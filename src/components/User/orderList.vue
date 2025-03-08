<template>
    <div class="order-container">
      <ul>
        <li v-for="order in orders" :key="order.id" class="order-item">
          <el-image class="order-image" :src="getImageUrl(order.artworkSimple.coverImage)" ></el-image>
          <div class="order-info">
            <p class="text"><strong>发货地址:</strong> 官方地址（武汉市 江夏区 .......）</p>
            <p class="text"><strong>商品名称:</strong> {{ order.artworkSimple.name }}</p>
            <p class="text"><strong>价格:</strong> ¥{{ order.artworkSimple.price }}</p>
          </div>
          
          <div class="right">
            <p class="status">状态：{{getStatusType(order.orderStatus) }}</p>
            <p v-if="order.orderStatus !== 1" class="small-text">快递单号:{{ order.trackingNumberSellerToOfficial }}</p>
            <p v-if="order.orderStatus === 1" class="small-text">请在3天内发货</p>
            <el-button v-if="order.orderStatus === 1" type="primary" class="ship-button" @click="openDialog(order.orderDetailId)">我已发货</el-button>

          </div>
        </li>
      </ul>

      <!-- 弹窗输入快递单号 -->
      <el-dialog v-model="dialogVisible" title="输入快递单号" width="400px">
        <el-input v-model="trackingNumber" placeholder="请输入快递单号"></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmShipment">确认发货</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
</template>
  
<script setup>
import { ref, onMounted, reactive } from "vue";
import { selectOrderDetailsList,Shipping,selectSellerOrderList } from "@/api/order/order.js";
import { getImageUrl } from '@/utils/utils';
import { ElMessage } from "element-plus";

const props = defineProps({
  userId: { type: Number, default: null },
});

const orders = ref([]);
const dialogVisible = ref(false);
const trackingNumber = ref('');
const currentOrderId = ref(null);

const searchData = reactive({
  orderStatus: 1,
  params: {
    userId: props.userId,
  },
});

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

// 订单数据加载
const loadOrder = async () => {
  try {
    const res = await selectSellerOrderList();
    orders.value = res.rows || [];
    console.log(res);
  } catch (error) {
    console.error("获取订单失败", error);
  }
};

// 打开弹窗
const openDialog = (orderId) => {
  currentOrderId.value = orderId;
  trackingNumber.value = '';
  dialogVisible.value = true;
};

// 确认发货
const confirmShipment = () => {
  if (!trackingNumber.value) {
    ElMessage.warning("请输入快递单号");
    return;
  }
  Shipping(currentOrderId.value, trackingNumber.value).then (() => {
    ElMessage.success(`订单 ${currentOrderId.value} 已成功发货，单号：${trackingNumber.value}`);
    loadOrder();
  });
  dialogVisible.value = false;
};

onMounted(() => {
  loadOrder();
});
</script>
  
<style scoped lang="scss">
.order-container {
  max-width: 1200px;
  margin: 0 auto;
}

ul {
  list-style: none;
  padding: 0;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--art-border-color);
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: var(--art-gray-100);
}

.order-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 5px;
}

.order-info {
  flex-grow: 1;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.status {
  font-weight: bold;
}

.small-text {
  font-size: 12px;
  color: gray;
  margin-top: 5px;
}

.ship-button {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
.text{
    margin-top: 5px;
}
</style>
