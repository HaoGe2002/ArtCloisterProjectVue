<template>
    <HeaderBar />
    <div class="order-container">
      <h1 class="title">我的订单</h1>
      <el-divider />
      
      <!-- 订单列表 -->
      <div v-if="orders.length > 0">
        <div v-for="order in orders" :key="order.orderDetailId" class="order-item">
          <div class="order-header">
            <span class="order-time">下单时间: {{ parseTime(order.createdAt) }}</span>
            <span >{{ getStatusText(order.orderStatus) }}</span>
          </div>
          
          <div class="order-content">
            <el-image
              :src="getImageUrl(order.artworkSimple.coverImage)"
              fit="cover"
              class="product-image"
            />
            <div class="product-info">
              <span class="product-title">{{ order.artworkSimple.name }}</span>
              <span class="product-author">作者 : {{ order.artworkSimple.nickname }}</span>
              <span v-if="order.frameTypes?.frameTypeId">装裱: {{ order.frameTypes.frameTypeName }}</span>
              <span v-else>无装裱</span>
              <span class="product-price">￥{{ order.frameTypes.price}}</span>
            </div>
          </div>
          
          <div class="order-footer">
            <span class="total-price">总金额: ￥{{ order.totalPrice }}</span>
            <div>
                <el-button v-if="order.orderStatus === 0" type="danger" @click="cancelOrder(order.orderDetailId)">取消订单</el-button>
                <el-button v-if="order.orderStatus === 0" type="primary" @click="confirmPayment([order.orderDetailId])">确认支付</el-button>
                  
                <el-button v-if="order.orderStatus === 4"  type="primary" @click="confirmReceipts(order.orderDetailId)">确认收货</el-button>
      
                
                <el-button @click="openOrderDetail(order)">查看详情</el-button>
            </div>
            

          </div>
        </div>
      </div>
      
      <div v-else class="empty-order">
        <p>您还没有订单</p>
      </div>
  
      <!-- 订单详情弹窗 -->
      <el-dialog v-model="orderDetailDialog" title="订单详情" width="600px">
            <el-descriptions :column="1" border style="margin-top: 20px;">
                <el-descriptions-item label="订单号">{{ selectedOrder?.orderNumber }}</el-descriptions-item>
            </el-descriptions>

            <el-descriptions :column="2" border>
                <el-descriptions-item label="收件人">{{ selectedOrder?.buyerReceiver }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{ selectedOrder?.buyerPhone }}</el-descriptions-item>
                <el-descriptions-item label="收货地址">{{ selectedOrder?.buyerAddress }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">{{ getStatusText(selectedOrder?.orderStatus) }}</el-descriptions-item>
                <el-descriptions-item label="下单时间">{{ parseTime(selectedOrder?.createdAt) }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{ parseTime(selectedOrder?.updatedAt) }}</el-descriptions-item>
                
            </el-descriptions>
            <el-descriptions :column="1" border style="margin-top: 20px;">
              <el-descriptions-item label="卖家发往官方单号" v-if="selectedOrder?.trackingNumberSellerToOfficial">{{ selectedOrder?.trackingNumberSellerToOfficial }}</el-descriptions-item>
              <el-descriptions-item label="官方发往买家单号" v-if="selectedOrder?.trackingNumberOfficialToBuyer">{{ selectedOrder?.trackingNumberOfficialToBuyer }}</el-descriptions-item>
            </el-descriptions>
            
            <el-divider />
            
            <h3>商品信息</h3>
            <el-descriptions :column="1" border style="margin-top: 20px;">
                <el-descriptions-item>
                    <el-image :src="getImageUrl(selectedOrder?.artworkSimple?.coverImage)" fit="cover" style="width: 100px; height: 100px; border-radius: 5px;" />
                </el-descriptions-item>
                <el-descriptions-item label="商品名称">{{ selectedOrder?.artworkSimple?.name }}</el-descriptions-item>
                <el-descriptions-item label="作者">{{ selectedOrder?.artworkSimple?.nickname }}</el-descriptions-item>
                <el-descriptions-item label="尺寸">{{ selectedOrder?.artworkSimple?.width }} x {{ selectedOrder?.artworkSimple?.height }}  <span v-if="selectedOrder?.artworkSimple?.length">x {{ selectedOrder?.artworkSimple?.length }}</span> CM</el-descriptions-item>
                <el-descriptions-item label="价格">￥{{ selectedOrder?.artworkSimple?.price }}</el-descriptions-item>                
            </el-descriptions>
            <el-divider />
            <h3>装裱信息</h3>
            <el-descriptions :column="1" border style="margin-top: 20px;">
                <el-descriptions-item>
                    <el-image :src="getImageUrl(selectedOrder?.frameTypes?.imageUrl)" fit="cover" style="width: 100px; height: 100px; border-radius: 5px;" />
                </el-descriptions-item>
                <el-descriptions-item label="装裱">{{ selectedOrder?.frameTypes?.frameTypeName || '无装裱' }}</el-descriptions-item>
                <el-descriptions-item label="装裱价格">￥ {{ selectedOrder?.frameTypes?.price }}</el-descriptions-item>
            </el-descriptions>

            <el-divider />

                <div><span>总计：</span>
                    <span style="font-weight: bold; font-size: 40px;">￥{{ selectedOrder?.totalPrice }}</span>
                </div>
            <template #footer>
                <el-button @click="orderDetailDialog = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { selectOrderDetailsList,confirmPaymentOrder,deleteOrderDetail,confirmReceipt } from '@/api/order/order.js';
  import HeaderBar from '@/components/Pages/mune/header.vue';
  import { getImageUrl, parseTime } from '@/utils/utils';
  import { useUserStore } from '@/store/modules/userStore';
  import { ElMessage, ElMessageBox } from "element-plus";

  const userStore = useUserStore();
  const router = useRouter();
  const orders = ref([]);
  const orderDetailDialog = ref(false);
  const selectedOrder = ref(null);
  
  const loadOrders = async () => {
    selectOrderDetailsList({ buyerId: userStore.info.userId }).then(response => {
        console.log(response);
      orders.value = response.rows;
    });
  };
  
  const getStatusText = (status) => {
  const statusMap = {
    0: "待支付",
    1: "已支付，等待卖家发货",
    2: "卖家已发货，等待官方验收",
    3: "官方验收中",
    4: "官方已发货",
    5: "交易完成",
    "-1": "订单已取消"
  };
  return statusMap[status] || "未知状态";
};

  
  
  const cancelOrder = (orderId) => {
    deleteOrderDetail([orderId]).then(() => {
      ElMessage.success('订单已取消');
      loadOrders();
    });
  };
  
const confirmPayment = (orderId) => {
    ElMessageBox.confirm(
        '确定要支付该订单吗？',
        '确认支付',
        {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning',
        }
    ).then(() => {
        confirmPaymentOrder(orderId).then(() => {
            ElMessage.success('订单已支付');
            loadOrders();
        });
    }).catch(() => {
        ElMessage.info('支付已取消');
    });
  };

  const confirmReceipts = (orderId) => {
    confirmReceipt(orderId).then(() => {
      ElMessage.success('订单已确认收货');
      loadOrders();
    });
  };
  
  const openOrderDetail = (order) => {
    selectedOrder.value = order;
    orderDetailDialog.value = true;
  };
  
  onMounted(() => {
    loadOrders();
  });
  </script>
  
<style scoped lang="scss">
  .product-title{
    font-size: 18px;
    font-weight: bold;
  }
  .order-container {
    width: 90%;
    margin: 10px auto;
  }
  
  .title {
    font-size: 28px;
    font-weight: bold;
    text-align: left;
    margin-bottom: 10px;
    color: #0077ff;
  }
  
  .empty-order {
    text-align: center;
    font-size: 18px;
    color: var(--art-gray-200);
  }
  
  .order-item {
    margin: 10px 0;
    padding: 15px;
    border: 1px solid gray;
    border-radius: 6px;
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .order-content {
    display: flex;
    align-items: center;
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    margin-right: 15px;
    border-radius: 4px;
  }
  
  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .product-price {
    font-size: 18px;
    font-weight: bold;
    color: #ca4c4c;
  }
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  
  .total-price {
    font-size: 18px;
    font-weight: bold;
  }
</style>
  