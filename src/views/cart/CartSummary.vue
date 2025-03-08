<template>
  <div class="cart-summary-container">
    <div class="button-container">
      <div>
        <el-checkbox v-model="selectAll" @change="toggleSelectAll">全选</el-checkbox>
        <el-button style="margin: 0 0 5px 20px;" size="small" @click="removeSelected">移除选中商品</el-button>
      </div>

      <div class="cart-summary">
        <span>已选商品 {{ selectedItems.length }} 件（不含运费、装裱费）</span>
        <span class="total-price">￥{{ total }}</span>
        <el-button type="primary" @click="checkout">结算</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  total: { type: Number, required: true },
  selectedItems: { type: Array, required: true },
});

const emit = defineEmits(['selectAll', 'removeSelected']);
const selectAll = ref(false);

// 定义 toggleSelectAll 方法
const toggleSelectAll = () => {
  emit('selectAll', selectAll.value);
};

// 移除选中商品
const removeSelected = () => {
  emit('removeSelected');
};

// 结算
const checkout = () => {
  console.log('结算中...');
};
</script>

<style scoped lang="scss">
  .cart-summary-container {
    margin: 0px auto;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 95%;
    background-color: var(--background-color);
  }
  .button-container{
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  .cart-summary {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .total-price {
    font-size: 24px;
    font-weight: bold;
    color: rgba(202, 76, 76, 0.842);
  }
</style>
