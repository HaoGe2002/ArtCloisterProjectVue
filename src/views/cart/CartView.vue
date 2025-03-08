<template>
  <HeaderBar />
  <div class="cart-container">
    <h1 class="title">购物车</h1>
    <el-divider />

    <!-- 购物车列表 -->
    <div v-if="cartItems.length > 0">
      <div v-for="item in cartItems" :key="item.cartItemId" class="cart-item">
        <div class="item-container">
          <div class="left-section">
            <el-checkbox v-model="item.selected" @change="updateSelected" />
            <el-image
              @click.stop="goToArtworkDetail(item.artworkSimple.artworkId)"
              :src="getImageUrl(item.artworkSimple.coverImage)"
              fit="cover"
              class="item-image"
            />
          </div>

          <div class="center-section">
            <span class="item-title">{{ item.artworkSimple.name }}  </span>
            <span class="item-author">作者 : {{ item.artworkSimple.nickname }}</span>
            <span>{{ item.artworkSimple.width }} x {{ item.artworkSimple.height }} CM</span>
            <span v-if="item.frameTypes.frameTypeId">装裱: {{ item.frameTypes.frameTypeName }}</span>
            <span v-else>无装裱</span>
            <span>类型： {{ item.artworkSimple.artworkSubcategories.subcategoryName }}</span>
          </div>

          <div class="right-section">
            <span class="item-price">￥{{ item.artworkSimple.price + item.frameTypes.price }}</span>
          </div>
          
        </div>
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>您的购物车是空的</p>
    </div>

    <!-- 购物车总计 -->
    <div class="cart-summary-container">
      <div class="cart-summary">
        <div class="left-sections">
          <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
          <el-button size="small" @click="removeSelected">移除选中商品</el-button>
        </div>
        
        <div class="middle-section">

        </div>
        
        <div class="right-sections">
          <span>已选 {{ selectedItems.length }} 件</span>
          <span class="total-price">￥{{ totalPrice }}</span>
          <el-button type="primary" :disabled="selectedItems.length === 0" @click="checkout">结算</el-button>
        </div>
      </div>
    </div>
    <el-dialog v-model="addressDialogVisible" title="确认支付" width="600px">
  <!-- 选择收货地址 -->
      <div class="address-selection">
        <el-select v-model="selectedAddress" placeholder="请选择收货地址" style="width: 100%;">
          <el-option 
            v-for="address in addressList" 
            :key="address.addressId" 
            :label="`${address.contact} - ${address.phoneNumber} (${address.state} ${address.city} ${address.address})`"
            :value="address.addressId">
          </el-option>
        </el-select>
      </div>

  <!-- 选中的商品列表 -->
      <div class="selected-items">
        <h3 style="margin-bottom: 5px;">订单商品</h3>
        <div v-for="item in selectedItems" :key="item.cartItemId" class="selected-item">
          <el-image
            :src="getImageUrl(item.artworkSimple.coverImage)"
            fit="cover"
            class="item-image"
          />
          <div class="item-info">
            <p class="item-title">{{ item.artworkSimple.name }}</p>
            <p class="item-author">作者: {{ item.artworkSimple.nickname }}</p>
            <p>尺寸: {{ item.artworkSimple.width }} x {{ item.artworkSimple.height }} CM</p>
            <p v-if="item.frameTypes.frameTypeId">装裱: {{ item.frameTypes.frameTypeName }}</p>
            <p v-else>无装裱</p>
            <p class="item-price">￥{{ item.artworkSimple.price + item.frameTypes.price }}</p>
          </div>
        </div>
      </div>

  <!-- 总价 -->
      <div class="order-total">
        <span>总价：</span>
        <span class="total-price">￥{{ totalPrice }}</span>
      </div>

  <!-- 按钮 -->
      <template #footer>
        <el-button @click="cancelOrder">取消</el-button>
        <el-button type="primary" @click="confirmPayment">结算</el-button>
      </template>
    </el-dialog>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getCartItems,removeCartItems } from '@/api/cart/cart.js';
import { ElMessage } from 'element-plus';
import HeaderBar from '@/components/Pages/mune/header.vue';
import { getImageUrl,parseTime } from '@/utils/utils';
import {getAddressList} from '@/api/user/shipAddress.js';

const router = useRouter();
const cartItems = ref([]); // 购物车数据
const selectedItems = ref([]); // 选中的商品
const selectAll = ref(false);
const addressDialogVisible = ref(false);
const addressList = ref([]);
const selectedAddress = ref(null);
// **获取购物车数据**
const loadCartItems = async () => {
  getCartItems().then (response => {
    cartItems.value = response.data.map(item => ({
      ...item,
      selected: false,
    }));
    console.log(cartItems.value);
  });
};

// **计算总价**
const totalPrice = computed(() => {
  return selectedItems.value.reduce((sum, item) => sum + item.artworkSimple.price + item.frameTypes.price, 0);
});

// **更新选中状态**
const updateSelected = () => {
  selectedItems.value = cartItems.value.filter((item) => item.selected);
};

// **全选/取消全选**
const toggleSelectAll = () => {
  cartItems.value.forEach((item) => {
    item.selected = selectAll.value;
  });
  updateSelected();
};

// **批量删除选中商品**
const removeSelected = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要删除的商品');
    return;
  }
    const idsToRemove = selectedItems.value.map(item => item.cartItemId);
    console.log(idsToRemove);
    removeCartItems(idsToRemove).then (response => {
      ElMessage.success('移除成功');
      loadCartItems();
      updateSelected();
      selectedItems.value = [];
    });
};

// **跳转到艺术品详情**
const goToArtworkDetail = (artworkId) => {
  if (!artworkId) {
    console.error('ID 无效:', artworkId);
    return;
  }
  router.push(`/artwork/${artworkId}`);
};

import {userCreatOrder,confirmPaymentOrder} from '@/api/order/order.js';
const checkout = () => {
  getAddressList().then(res => {
    if (res.data.length === 0) {
      ElMessage.warning('请先添加收货地址');
      router.push('/edit_user');
      return;
    }
    addressList.value = res.data;
    // 查找默认地址（isDefault === 1）
    const defaultAddress = addressList.value.find(address => address.isDefault === 1);
    console.log('默认地址:', defaultAddress);
    // 设定默认选中地址（如果存在）
    if (defaultAddress.addressId) {
      
      selectedAddress.value = defaultAddress.addressId;
    } else {
      selectedAddress.value = null; // 没有默认地址时，用户需要手动选择
    }
    // 打开弹窗
    addressDialogVisible.value = true;
  });
  loadCartItems();
  updateSelected();
};

const cancelOrder = () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址');
    return;
  }
  console.log('提交订单:', selectedAddress.value);
  userCreatOrder(
    selectedItems.value.map(item => item.cartItemId),
    selectedAddress.value
  ).then(() => {
    ElMessage.success('请尽快支付！');
    addressDialogVisible.value = false;
    removeSelected()
    router.push('/order');
  });
};

// **确认支付**
const confirmPayment = () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址');
    return;
  }
  console.log('提交订单:', selectedAddress.value);
  userCreatOrder(
    selectedItems.value.map(item => item.cartItemId),
    selectedAddress.value
  ).then((res) => {
    confirmPaymentOrder(res.data).then(() => {
      ElMessage.success('支付成功！');
      addressDialogVisible.value = false;
      router.push('/order');
      removeSelected()
    }). catch((error) => {
      router.push('/order');
    });
  });
};

// 确认选择地址并跳转到订单页面
// const confirmAddress = () => {
//   if (!selectedAddress.value) {
//     ElMessage.warning('请选择收货地址');
//     return;
//   }
//   console.log(selectedAddress.value);
//   userCreatOrder(selectedItems.value.map(item => item.cartItemId),selectedAddress.value.addressId).then(res => {
//     addressDialogVisible.value = false;
//     router.push({
//       path: '/order',
//     });
//   });

// };


// **页面加载时获取数据**
onMounted(() => {
  loadCartItems();
});
</script>

<style scoped lang="scss">
.cart-container {
  width: 95%;
  margin: 10px auto;
}

.title {
  font-size: 28px;
  font-weight: bold;
  text-align: right;
  margin-right: 80px;
  color: #0077ff;
}

.empty-cart {
  text-align: center;
  font-size: 18px;
  color: var(--art-gray-200);
}

.cart-item {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 6px;
}
.item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
}
.left-section {
  display: flex;
  align-items: center;
}
.item-image {
  width: 110px;
  height: 110px;
  margin-left: 10px;
  border-radius: 4px;
}
.center-section {
  flex: 1;
  display: flex;
  margin-left: 20px;
  flex-direction: column;
  gap: 5px;
}
.item-title {
  font-weight: bold;
  font-size: 16px;
}
.item-author {
  font-size: 14px;
  color: #666;
}
.right-section {
  
  height: 90px;
}
.item-price {
  font-size: 18px;
  font-weight: bold;
}
.cart-summary-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px;
  background-color: var(--art-gray-200);
  padding: 15px 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1); /* 阴影增强层次感 */
  display: flex;
  justify-content: center; /* 居中对齐内容 */
  align-items: center;
}

.cart-summary {
  display: flex;
  width: 80%;
  justify-content: space-between; /* 让内容均匀分布 */
  align-items: center;
}

.total-price {
  font-size: 20px;
  font-weight: bold;
  color: #ca4c4c;
}
.left-sections {
  display: flex;
  width: 15%;
  justify-content: space-between;
  align-items: center;
}
.right-sections{
  display: flex;
  width: 20%;
  justify-content: space-between;
  align-items: center;
}
/* 地址选择 */
.address-selection {
  margin-bottom: 20px;
}

/* 订单商品 */
.selected-items {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px 0;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}

.selected-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin-right: 10px;
}

.item-info {
  flex: 1;
}

.item-title {
  font-weight: bold;
}

.item-author {
  font-size: 14px;
  color: #666;
}

.item-price {
  font-size: 16px;
  font-weight: bold;
  color: #ca4c4c;
}

/* 总价 */
.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  padding: 10px 0;
}

.total-price {
  color: #ca4c4c;
  font-size: 20px;
}
</style>
