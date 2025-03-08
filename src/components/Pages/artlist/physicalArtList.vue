<template>
  <div class="art-list" 
       ref="artListContainer" 
       :style="gridStyle" 
       v-infinite-scroll="loadItems">
    <div
      class="art-column"
      :class="{
        'first-column': index === 0,
        'last-column': index === columns.length - 1,
      }"
      v-for="(column, index) in columns"
      :key="index"
    >
      <div class="art-item" 
           v-for="item in column" 
           @click="handleItemClick(item.artworkId)" 
           :key="item.artworkId">
        <div style="position: relative;">
          <img :src="getCachedImageSrc(baseUrl + item.coverImage)" alt="图片加载失败" />
          <div class="art-item-info">
            <div style="display: flex; justify-content: start; margin-bottom: 5px; font-weight: bold;">
              <span>{{ item.name }}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 14px; color: #999">{{ item.description }}</span>
              <span style="font-size: 14px; color: #999">¥{{ item.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="art-item-hover-all">
            <div class="art-item-hover">
              <img :src="getCachedImageSrc(baseUrl + item.coverImage)" alt="图片加载失败" />
              <div style="height: 60px;display: flex; align-items: center;justify-content: center;">
                <div style="display: flex; flex-direction: column;">
                  <span class="item-detail-name">作者</span>
                  <span class="item-detail-data">{{ item.nickname }}</span>
                </div>
                <el-divider style="height: 40px;margin: 0 15px;" direction="vertical" />
                <div style="display: flex; flex-direction: column;">
                  <span class="item-detail-name">类型</span>
                  <span class="item-detail-data">{{ item.artworkSubcategories.subcategoryName }}</span>
                </div>
                <el-divider style="height: 40px;margin: 0 15px;" direction="vertical" />
                <div style="display: flex; flex-direction: column;">
                  <span class="item-detail-name">价格</span>
                  <span class="item-detail-data">¥{{ item.price.toFixed(2)}}</span>
                </div>
                <el-divider style="height: 40px;margin: 0 15px;" direction="vertical" />
                <div style="display: flex; flex-direction: column;">
                  <span class="item-detail-name">尺寸</span>
                  <div style="display:flex;">
                    <span class="item-detail-data">{{ item.width }}*{{ item.height }}</span>
                    <span class="item-detail-data" v-if="item.depth">*{{ item.depth }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  </div>
  <div v-if="currentPage > totalPages">
    <el-empty description="没有了" :image-size="50" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { getArtworkList } from '@/api/artwork/artwork';
import { useRouter } from 'vue-router';

const baseUrl = import.meta.env.VITE_APP_BASE_API;
const router = useRouter();

const props = defineProps({
  artForm: { type: Object },
  isPreview: { type: Boolean, default: false },
  userId: { type: Number, default: null },
  keyword: { type: String, default: null },
  categoryId: { type: Number, default: null },
  subcategoryId: { type: Number, default: null },
  isFavorite: { type: Boolean, default: false },
  tagName: { type: Array, default: () => [] },
});

const columns = ref([]);
const artListContainer = ref(null);
const items = ref([]);
const columnWidth = 250;
const isImageLoaded = ref(false);
const gridColumns = ref(1);
const imageCache = {}; // 用于缓存图片数据
const totalPages = ref(2);
const currentPage = ref(1);
const isLoading = ref(false); // 防止重复加载

const gridStyle = computed(() => ({
  'grid-template-columns': `repeat(${gridColumns.value}, minmax(215px, 1fr))`,
}));

// ---------------- 图片缓存逻辑 ----------------
const getCachedImageSrc = (url) => {
  if (imageCache[url]) {
    return imageCache[url]; // 已缓存则直接返回
  } else {
    fetchImageAndCache(url);
    return url; // 使用原始 URL 作为占位符
  }
};

const fetchImageAndCache = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    imageCache[url] = objectUrl;
  } catch (error) {
    console.error('图片加载失败:', error);
  }
};

const clearImageCache = () => {
  for (const url in imageCache) {
    URL.revokeObjectURL(imageCache[url]);
    delete imageCache[url];
  }
};

// ---------------- 数据加载与高度计算 ----------------
const loadItems = async () => {
  if (isLoading.value || currentPage.value > totalPages.value) return;
  isLoading.value = true;
  
  if (props.isPreview) {
    // 预览模式处理（根据实际需要填充数据）
  } else {
    const params = {
      pageNum: currentPage.value,
      pageSize: 10,
      userId: props.userId,
      keyword: props.keyword,
      categoryId: props.categoryId,
      subcategoryId: props.subcategoryId,
      isFavorite: props.isFavorite,
      tagName: props.tagName.join(","),
    };
    const res = await getArtworkList(params);
    // 累加新数据到 items
    items.value.push(...res.artworks.list);
    totalPages.value = res.artworks.pages;
    currentPage.value++;
  }
  await initializeItemHeights();
  await initializeColumns();
  isLoading.value = false;
};

const getItemHeight = (item) => {
  if (item.height) return Promise.resolve(item.height);
  return new Promise((resolve) => {
    const img = new Image();
    // 使用统一的 URL 计算图片高度
    img.src = baseUrl + item.coverImage;
    img.onload = () => {
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      item.height = columnWidth * aspectRatio;
      resolve(item.height);
    };
    img.onerror = () => {
      item.height = 300;
      resolve(item.height);
    };
  });
};

const initializeItemHeights = async () => {
  for (const item of items.value) {
    if (!item.height) {
      await getItemHeight(item);
    }
  }
  isImageLoaded.value = true;
};

// ---------------- 瀑布流列布局逻辑 ----------------
const calculateColumns = async () => {
  await nextTick();
  const containerWidth = artListContainer.value?.clientWidth || 0;
  const numberOfColumns = Math.max(1, Math.floor(containerWidth / columnWidth));
  columns.value = Array.from({ length: numberOfColumns }, () => []);
  gridColumns.value = numberOfColumns;
};

const distributeItemsToColumns = () => {
  // 清空各列数据
  columns.value.forEach((column) => column.splice(0));
  // 将每个 item 分配到高度最短的列
  items.value.forEach((item) => {
    let shortestColumn = columns.value[0];
    columns.value.forEach((column) => {
      if (getColumnHeight(column) < getColumnHeight(shortestColumn)) {
        shortestColumn = column;
      }
    });
    shortestColumn.push(item);
  });
};

const getColumnHeight = (column) => {
  return column.reduce((total, item) => total + (item.height || 300), 0);
};

const initializeColumns = async () => {
  await calculateColumns();
  distributeItemsToColumns();
};

// ---------------- 防抖函数与事件注册 ----------------
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

const debouncedInitializeColumns = debounce(initializeColumns, 200);

// ---------------- 监听 props 变化 ----------------
watch(
  () => ({
    categoryId: props.categoryId,
    tagName: props.tagName,
    userId: props.userId,
    keyword: props.keyword,
    subcategoryId: props.subcategoryId,
    isFavorite: props.isFavorite,
  }),
  async () => {
    // 这里仅重新计算列布局，不重复加载数据
    await initializeColumns();
  }
);

watch(
  () => props.artForm,
  async () => {
    await initializeColumns();
  }
);

// ---------------- 处理点击事件 ----------------
const handleItemClick = (id) => {
  if (!id) {
    console.error('ID 无效:', id);
    return;
  }
  router.push(`/art_print/${id}`);
};

// ---------------- 生命周期 ----------------
onMounted(async () => {
  await loadItems();
  await initializeColumns();
  window.addEventListener('resize', debouncedInitializeColumns);
});

onUnmounted(() => {
  clearImageCache();
  window.removeEventListener('resize', debouncedInitializeColumns);
});
</script>

  
<style scoped>
.item-detail-name{
  margin: 0 5px;
  font-size: 14px;
  color: #ffffff;
}
.item-detail-data{
  font-size: 14px;
  color: #999;
}
.art-item-hover-all {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* 默认隐藏 */
  transition: opacity 0.35s; /* 添加淡入淡出效果 */
  pointer-events: none; /* 防止鼠标事件穿透问题 */
}
/* 默认居中显示 */
.art-item-hover {
  position: absolute;
  width: 450px;
  max-width: 100vh;
  box-shadow: 0 0 7px #000;
  background-color: gray;
  z-index: 2;
  transform: translate(-50%, -50%); /* 居中显示 */
  left: 50%;
  top: 50%;
}

/* 第一列：悬浮框左对齐 */
.first-column .art-item-hover {
  transform: translate(0, -50%);
  left: 0;
  top: 50%;
}
.art-item-info{
  height: 40px;
  display: flex;
  flex-direction: column;
  padding: 7px 9px 9px 9px;
}
/* 最后一列：悬浮框右对齐 */
.last-column .art-item-hover {
  transform: translate(-65%, -50%);
  right: 0;
  top: 50%;
}
.art-item:hover .art-item-hover-all {
  z-index: 50;
  opacity: 1; /* 悬停时显示 */
  pointer-events: none; /* 悬停时启用鼠标事件 */
}

.art-item-hover {
  position: absolute;
  width: 450px;
  max-width: 100vh;
  box-shadow: 0 0 7px #000;
  background-color: #222;
  z-index: 2;
  transform: translate(-50%, -50%); /* 移动到父元素中心 */
  left: 50%;
  top: 50%;
}
.art-list {
  display: grid;
  box-sizing: border-box;
  gap: 16px;
  padding: 16px;
}

.art-column {
  flex: 1; /* 每列等宽 */
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.art-item {
  cursor: pointer;
  background-color: #222;
  color: #fff;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.art-item img {
  width: 100%;
  height: auto;
}
</style>