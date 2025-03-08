<template>
  <div class="cart-item">
    <div style="margin-bottom: 15px; padding: 5px; background-color: gray;">
    </div>
    <div class="item-container">
      <div class="left-section">
        <el-checkbox v-model="localSelected" @change="handleSelectionChange" />
        <el-image
          @click.stop="handleItemClick(item)" 
          :src="item.imageUrl"
          fit="cover"
          class="item-image"
        />
      </div>
      <div class="center-section">
        <span class="item-title">{{ item.title }}</span>
        <span  class="item-author">{{ item.creatorNickname }}</span>
        <span v-if ="typeCache === 2">{{ item.width }} * {{ item.height }} <span v-if="item.depth"> * {{ item.depth }}</span> CM</span>
        <span v-if ="typeCache === 2">无表框</span>
      </div>
      <div class="right-section">
        <span class="item-price">￥{{ item.price }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
  item: { type: Object, required: true },
  selected: { type: Boolean, required: true },
});
const emit = defineEmits(['updateSelected']);

const localSelected = ref(props.selected);
const typeCache = ref(null); // 用于存储类型信息

// 获取类型并缓存
const fetchItemType = async (item) => {
};

// 页面加载时获取类型
onMounted(() => {
  fetchItemType(props.item);
});

// 同步选中状态
watch(
  () => props.selected,
  (newVal) => {
    localSelected.value = newVal;
  }
);

const handleItemClick = async (item) => {
  if (!item.artworkId) {
    console.error('ID 无效:', item.artworkId);
    return;
  }
  const response = await getType(item.categoryId);
  if (response.data.data.parentCategoryId === 2) {
    router.push(`/art_print/${item.artworkId}`);
  } else {
    router.push(`/artwork/${item.artworkId}`);
  }
};

// 通知父组件选中状态的变更
const handleSelectionChange = (checked) => {
  emit('updateSelected', props.item.artworkId, checked);
};
</script>
  
<style scoped lang="scss">
  .cart-item {
    margin: 10px 0;
    padding: 0 0px 15px 0px;
    border: 1px solid gray;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 虚拟塑胶效果 */
  }
  .item-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px 0px 15px;
  }
  
  .left-section {
    display: flex;
    align-items: center;
    margin-right: 15px;
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
    flex-direction: column;
    gap: 5px;
  }
  
  .item-tag {
    margin-bottom: 5px;
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
    margin-bottom: 10px;
    display: block;
  }
</style>
  