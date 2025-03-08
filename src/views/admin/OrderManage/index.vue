<template>
    <div class="artwork-review">
        <el-card>
            <div class="header">
                <el-input v-model="searchData.params.name" placeholder="按艺术品名称搜索" clearable style="width: 200px;" />
                <el-input v-model="searchData.buyerUsername" placeholder="按买家用户名搜索" clearable style="width: 200px;" />
                <el-input v-model="searchData.orderNumber" placeholder="按订单号搜索" clearable style="width: 200px;" />
                <el-select v-model="searchData.orderStatus" placeholder="订单状态" clearable style="width: 150px;">
                    <el-option label="待支付" value="0" />
                    <el-option label="已支付，等待卖家发货" value="1" />
                    <el-option label="卖家已发货，等待官方验收" value="2" />
                    <el-option label="官方验收中" value="3" />
                    <el-option label="官方已发货" value="4" />
                    <el-option label="交易完成" value="5" />
                    <el-option label="订单已取消" value="-1" />
                </el-select>
                
                <el-select v-model="searchData.officialVerificationStatus" placeholder="是否验收" clearable style="width: 150px;">
                    <el-option label="已验收" value="1" />
                    <el-option label="未验收" value="0" />
                </el-select>

                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="创建日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 300px;"
                    @change="handleDateChange"
                />
          
                <el-button type="primary" @click="fetchOrders" style="margin-left: 10px;">搜索</el-button>
            </div>

                    <!-- 📌 操作按钮 -->
            <div style="margin: 10px 0;">
                <el-button type="danger" @click="deleteSelectedOrders" :disabled="selectedOrder.length === 0"> 删除</el-button>
                <el-button type="primary" @click="updateSelectedOrders" :disabled="selectedOrder.length !== 1"> 编辑</el-button>
                <!-- <el-button type="primary" @click="addSelectedOrders"> 添加</el-button> -->
            </div>

            <el-table :data="Orders" border style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />

                <el-table-column prop="coverImage" label="封面图" align="center">
                  <template #default="{ row }">
                    <el-image :src="getImageUrl(row.artworkSimple.coverImage)" style="width: 55px; height: 55px;" fit="cover" />
                  </template>
                </el-table-column>

                <el-table-column prop="name" label="艺术品名称" align="center">
                  <template #default="{ row }">
                    <el-button type="text" @click="viewArtworkDetail(row)">
                      {{ row.artworkSimple.name }}
                    </el-button>
                  </template>
                </el-table-column>

                <el-table-column prop="orderNumber" label="订单号" align="center" />

                <el-table-column prop="totalPrice" label="交易总价" align="center" />
                <el-table-column prop="frameTypes.frameTypeName" label="裱框" align="center" />
                <el-table-column prop="buyerUsername" label="买家用户名" align="center" />
                <el-table-column prop="artworkSimple.username" label="卖家用户名" align="center" />

                <el-table-column prop="orderStatus" label="订单状态" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.orderStatus)">{{ getStatusType(row.orderStatus) }}</el-tag>
                  </template>
                </el-table-column>

                <el-table-column prop="officialVerificationStatus" label="是否装裱" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getStatusTagType(row.officialVerificationStatus)">{{ row.officialVerificationStatus?"是":"否" }}</el-tag>
                  </template>
                </el-table-column>
                
                <el-table-column prop="trackingNumberSellerToOfficial" label="卖家快递单" align="center" />
                <el-table-column prop="trackingNumberOfficialToBuyer" label="官方快递单" align="center" />

                <el-table-column label="操作" align="center">
                  <template #default="{ row }">
                    <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                      <el-button type="success" v-if="row.orderStatus === 2" @click="markAsReceived(row)">已收货</el-button>
                      <el-button type="primary" v-if="row.orderStatus === 3 && row.officialVerificationStatus === 0" @click="markForFramingAndVerification(row)">以装裱</el-button>
                      <el-button type="info" v-if="row.orderStatus === 3 && row.officialVerificationStatus === 1" @click="openDialog(row.orderDetailId)">已发货</el-button>
                      <!-- <el-button type="info"  @click="sendBack(row)">退还</el-button> -->
                    </div>
                  </template>
                </el-table-column>

                <el-table-column prop="createdAt" label="下单时间" align="center"/>

            </el-table>

            <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
              <el-form :model="formData" label-width="150px">
                <el-form-item label="订单号">
                  <el-input v-model="formData.orderNumber" />
                </el-form-item>

                <el-form-item label="卖家快递单">
                  <el-input v-model="formData.trackingNumberSellerToOfficial" />
                </el-form-item>

                <el-form-item label="官方快递单">
                  <el-input v-model="formData.trackingNumberOfficialToBuyer" />
                </el-form-item>

                <el-form-item label="订单状态">
                  <el-select v-model="formData.orderStatus" placeholder="请选择订单状态">
                    <el-option label="待支付" :value="0" />
                    <el-option label="已支付" :value="1" />
                    <el-option label="卖家已发货" :value="2" />
                    <el-option label="官方验收中" :value="3" />
                    <el-option label="官方已发货" :value="4" />
                    <el-option label="交易完成" :value="5" />
                    <el-option label="订单已取消" :value="-1" />
                  </el-select>
                </el-form-item>

                <el-form-item label="官方是否以装裱">
                  <el-select v-model="formData.officialVerificationStatus" placeholder="请选择是否装裱">
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                  </el-select>
                </el-form-item>

                <el-form-item label="装裱">
                  <el-select v-model="formData.frameTypeId" placeholder="请选择装裱">
                    <el-option v-for="frameType in frameOptions" :key="frameType.frameTypeId" :label="frameType.frameTypeName" :value="frameType.frameTypeId" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="交易总价">
                  <el-input v-model="formData.totalPrice" />
                </el-form-item>

                <el-form-item label="收件人">
                  <el-input v-model="formData.buyerReceiver" />
                </el-form-item>

                <el-form-item label="联系电话">
                  <el-input v-model="formData.buyerPhone" />
                </el-form-item>

                <el-form-item label="收件地址">
                  <el-input v-model="formData.buyerAddress" />
                </el-form-item>


              </el-form>
              <template #footer>
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="saveOrder">保存</el-button>
              </template>

            </el-dialog>
                      <!-- 弹窗输入快递单号 -->
          <el-dialog v-model="shippingDialogVisible" title="输入快递单号" width="400px">
            <el-input v-model="trackingNumber" placeholder="请输入快递单号"></el-input>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="shippingDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="markAsShipped">确认发货</el-button>
              </span>
            </template>
          </el-dialog>
        </el-card>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import {selectOrderDetailsList,deleteOrderDetail,officialReceiveOrder,officialFramedOrder,officialShipped,updateOrder} from '@/api/order/order.js'
import {selectAllFrames} from '@/api/frame/frame.js';
import {getImageUrl} from '@/utils/utils.js'
import { ElMessage, ElMessageBox } from 'element-plus';

const dialogVisible = ref(false);
const selectedOrder = ref([]);
const dialogTitle = ref("");
const frameOptions = ref([]);

//删除订单
const deleteSelectedOrders = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除这 ${selectedOrder.value.length} 条订单吗？`,
      '删除确认',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    const orderDetailIds = selectedOrder.value.map(order => order.orderDetailId);
    await deleteOrderDetail(orderDetailIds);
    
    ElMessage.success('订单已删除');
    await fetchOrders(); // 重新获取订单列表
    selectedOrder.value = []; // 清空选中项
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`删除失败: ${error.message}`);
    }
  }
}
const getStatusTagType = (status) => {
    switch (status) {
        case 0:
            return 'warning';
        case 1:
            return 'success';
        case 2:
            return 'info';
        case 3:
            return 'success';
        case 4:
            return 'success';
        case 5:
            return 'success';
        case -1:
            return 'danger';
       default:
    }
}
const getStatusType = (status) => {
    switch (status) {
        case 0:
            return '待支付';
        case 1:
            return '已支付';
        case 2:
            return '卖家已发货';
        case 3:
            return '官方验收中';
        case 4:
            return '官方已发货';
        case 5:
            return '交易完成';
        case -1:
            return '订单已取消';
        default:
            return '未知状态';
    }
}

const formData = ref({})

//编辑订单
const updateSelectedOrders = () => {
  if (selectedOrder.value.length === 1) {
    dialogTitle.value = "编辑订单";
    formData.value = {...selectedOrder.value[0]};
    dialogVisible.value = true;
    selectAllFrames().then ((res) => {
      frameOptions.value =  res.rows
    });

  }
}

//添加订单
const addSelectedOrders = () => {
    dialogTitle.value = "添加订单";
    formData.value = {
      orderStatus:0

    };
    dialogVisible.value = true;
}

//保存订单
const saveOrder = () => {
  updateOrder(formData.value).then (() => {
    ElMessage.success("订单已保存");
    fetchOrders();
    dialogVisible.value = false;
  });
}

// 按钮点击事件
const markAsReceived = (row) => {
  officialReceiveOrder(row.orderDetailId).then (() => {
    ElMessage.success("订单已收货");
    fetchOrders();
  });
}

const markForFramingAndVerification = (row) => {
  officialFramedOrder(row.orderDetailId).then (() => {
    ElMessage.success("以装裱");
    fetchOrders();
  });
}

const shippingDialogVisible = ref(false);
const currentOrderId = ref(null);
const trackingNumber = ref('');
// 打开弹窗
const openDialog = (orderId) => {
  currentOrderId.value = orderId;
  trackingNumber.value = '';
  shippingDialogVisible.value = true;
};

const markAsShipped = () => {
  if (!trackingNumber.value) {
    ElMessage.warning("请输入快递单号");
    return;
  }
  officialShipped(currentOrderId.value,trackingNumber.value).then (() => {
    ElMessage.warning("已发货");
    shippingDialogVisible.value = false;
    fetchOrders();
  });
}

const handleSelectionChange = (selectedRows) => {
    selectedOrder.value = selectedRows;
};
const Orders = ref([])

const totalOrders = ref(0)
  // 📆 日期范围
  const dateRange = ref([]);
  const handleDateChange = (val) => {
    if (val && val.length === 2) {
      searchData.params.beginTime = val[0];
      searchData.params.endTime = val[1];
    } else {
      searchData.params.beginTime = "";
      searchData.params.endTime = "";
    }
  };

  // 📑 分页
  const pageParams = reactive({
    pageNum: 1,
    pageSize: 7,
  });

    // 📡 获取艺术品数据
const fetchOrders = async () => {
  try {
    const res = await selectOrderDetailsList(searchData, pageParams);
    totalOrders.value = res.total;
    Orders.value = res.rows;
    console.log(res);
  } catch (error) {
    console.error("获取艺术品列表失败", error);
  }
};

  // 🔍 搜索条件
const searchData = reactive({
    name: "",
    params: {
      nickname: ""
    }
  })
  onMounted(() => {
    fetchOrders();
  })

</script>
<style scoped>
  .total-count {
    margin-right: 15px;
    font-size: 14px;
    color: #666;
  }
  .header {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
</style>