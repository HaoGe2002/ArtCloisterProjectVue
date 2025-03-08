<template>
    <div class="art-list" ref="artListContainer" :style="gridStyle">
      <div
        class="art-column"
        :class="{
          'first-column': index === 0,
          'last-column': index === columns.length - 1,
        }"
        v-for="(column, index) in columns"
        :key="index"
      >
        <div class="art-item" v-for="item in column" @click="handleItemClick(item.artworkId)" :key="item.artworkId">
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
                <img :src="getCachedImageSrc( baseUrl + item.coverImage)" alt="图片加载失败" />
                <div style="height: 60px;display: flex; align-items: center;justify-content: center;">
                  <div style="display: flex; flex-direction: column;">
                    <span class="item-detail-name">作者</span>
                    <span class="item-detail-data">{{ item.nickname }}</span>
                  </div>
                  <el-divider style="height: 40px;margin: 0 15px;" direction="vertical" />
                  <div style="display: flex; flex-direction: column;">
                    <span class="item-detail-name">类型</span>
                    <span class="item-detail-data">{{ item.categoryId }}</span>
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
    userId: { type: Number, default: null },           // 用户ID
    keyword: { type: String, default: null },          // 关键词搜索
    categoryId: { type: Number, default: null },   // 多个类别ID
    subcategoryId: { type: Number, default: null },   // 多个类别ID
    isFavorite: { type: Boolean, default: false },     // 是否为收藏的艺术品
    tagName: { type: Array, default: () => [] },        // 多个标签ID
});


const columns = ref([]);
const artListContainer = ref(null);
const currentPage = ref(1);
const pageSize = ref(20);
const items = ref([]);
const columnWidth = 250;
const isImageLoaded = ref(false);
const gridColumns = ref(1);
const imageCache = {}; // 用于缓存图片数据



const gridStyle = computed(() => ({
  'grid-template-columns': `repeat(${gridColumns.value}, minmax(215px, 1fr))`,
}));
const getCachedImageSrc = (url) => {
  if (imageCache[url]) {
    return imageCache[url]; // 如果已缓存，直接返回
  } else {
    // 否则下载并缓存
    fetchImageAndCache(url);
    return url; // 使用原始 URL 作为占位符，加载完成后会替换
  }
};


// 下载图片并缓存
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

// 清除图片缓存
const clearImageCache = () => {
  for (const url in imageCache) {
    URL.revokeObjectURL(imageCache[url]);
    delete imageCache[url];
  }
};


const loadItems = async () => {
    if (props.isPreview) {

    }else{
        const params = {
            pageNum: currentPage.value,  // 使用本地 `currentPage`
            pageSize: 10,
            userId: props.userId,
            keyword: props.keyword,
            categoryId: props.categoryId,
            subcategoryId: props.subcategoryId,
            isFavorite: props.isFavorite,
            tagName: props.tagName.join(",") // 数组转字符串，防止 Vue 序列化成对象
        };
        getArtworkList(params).then(res=>{
            console.log(res)
            items.value = res.artworks.list
        })
    }
    await initializeItemHeights();
};


// 获取图片高度
const getItemHeight = (item) => {
  if (item.height) return Promise.resolve(item.height);
  return new Promise((resolve) => {
    const img = new Image();
    img.src = item.imageUrl;
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
const initializeColumns = async () => {
  await calculateColumns();
  distributeItemsToColumns();
};

// 获取图片缓存
const calculateColumns = async () => {
  await nextTick();
  const containerWidth = artListContainer.value?.clientWidth || 0;
  const numberOfColumns = Math.max(1, Math.floor(containerWidth / columnWidth));
  columns.value = Array.from({ length: numberOfColumns }, () => []);
  gridColumns.value = numberOfColumns;
};

watch(() => ({
    categoryId: props.categoryId,
    tagName: props.tagIds,
    userId: props.userId,
    keyword: props.keyword,
}),async () => {
  await loadItems();
  initializeColumns();
});

watch(() => props.artForm,
async () => {
    await loadItems();
    initializeColumns();
  },
);

//items 均衡分配到列
const distributeItemsToColumns = () => {
  columns.value.forEach((column) => column.splice(0));
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
//获取列的总高度
const getColumnHeight = (column) => {
  return column.reduce((total, item) => total + (item.height || 300), 0);
};

//初始化 & 监听窗口变化
onMounted(async () => {
  await loadItems();
  initializeColumns();
  window.addEventListener('resize', debounce(initializeColumns, 200));
});

//清理监听器
onUnmounted(() => {
  clearImageCache();
  window.removeEventListener('resize', initializeColumns);
});
//限制 resize 触发频率
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

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