<template>
<el-dialog 
  v-model="isDialogVisible" 
  width="90%" 
  fullscreen
  :show-close="false"
  :modal="false"
  :close-on-click-modal="false"
  :lock-scroll="true"
  :destroy-on-close = "true"
  :close-on-press-escape = "true"
  custom-class="custom-dialog"
>   
    <artDetail
      :artworkId="artworkId"
      @close="handleClose"
    />
</el-dialog>

  <div class="art-list-container">
  <div class="art-list">
    <div class="grid-container" v-infinite-scroll="loadMore">
      <div
        class="grid-item"
        v-for="item in items"
        :key="item.artworkId"
        @click="handleClick(item.artworkId)"
      >
        <el-skeleton :loading="isLoading" animated>
          <template #template>
            <div class="item-image-skeleton">
              <el-skeleton-item variant="image" class="item-image-skeleton" />
            </div>
            <div class="item-info-skeleton">
              <el-skeleton-item variant="text" style="width: 70%;" />
              <el-skeleton-item variant="text" style="width: 50%;" />
            </div>
          </template>

          <template #default>
            <div class="item-image" 
            :style="{ backgroundImage: `url(${getImageUrl(item.coverImage)})` }">
          </div>
            <div class="color-overlay"></div>

            <div class="item-detail">
              <div class="item-icon">
                <el-icon><View /></el-icon>
                <div>{{ item.browsing }}</div>
              </div>
              <div class="item-icon">
                <el-icon><Star /></el-icon>
                <div>{{ item.favorites }}</div>
              </div>
            </div>

            <div class="item-info">
              <div class="item-author">
                <el-avatar shape="square" :size="40" :src="item.avatar ? getImageUrl(item.avatar) : defAva" />
              </div>
              <div class="item-title">
                <p>{{ item.name }}</p>
                <small>{{ item.nickname }}</small>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </div>
    <div v-if="currentPage > totalPages">
      <el-empty description="没有了" :image-size="50" />
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted,nextTick } from 'vue';
import { View, Star } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/utils/utils';
import {getArtworks} from "@/api/admin/artwork";

const router = useRouter();

import defAva from '@/assets/img/avatar/avatar.png'

const items = ref([]);

const currentPage = ref(1); // 当前页
const pageSize = ref(15); // 每页条数
const total = ref(3); // 总数据量
const totalPages = computed(() => Math.ceil(total.value / pageSize.value)); // 计算总页数
const isLoading = ref(false);

const artworkId = ref(null);

const resetState = () => {
  items.value = [];
  currentPage.value = 1;
  total.value = 15; // 🔹 确保重置 total，避免 currentPage > totalPages
  isLoading.value = false;
};

const props = defineProps({
  createdBy: { type: Number, default: null },           // 用户ID
  name: { type: String, default: null },          // 关键词搜索
  subcategoryId: { type: Number, default: null },   // 多个类别ID
  isFavorite: { type: Boolean, default: false },     // 是否为收藏的艺术品
  tagName: { type: Array, default: () => [] },        // 多个标签ID
  paramDate :{type: Object, default: () => ({}), required: false}
});

const loadMore = async () => {
  if (isLoading.value || currentPage.value > totalPages.value) return;
  isLoading.value = true;
  
  let params = {
    createdBy: props.createdBy,
    name: props.name,
    subcategoryId: props.subcategoryId,
    status: 4,
    params: {
      tags: props.tagName.join(","),
      isFavorite: props.isFavorite ? 1 : 0, // ✅ 转换为 0 或 1
    },
  };

  // **合并 props.paramDate 到 params.params**
  if (props.paramDate.name !== undefined) {
    params = props.paramDate
  }
  try {
    const res = await getArtworks(params, { pageNum: currentPage.value, pageSize: pageSize.value });

    if (res.rows.length) {
      items.value.push(...res.rows);
      total.value = res.total; // 更新总数据量
      currentPage.value++; // 只有数据成功加载，才增加页数
    }
  } catch (error) {
    console.error("加载失败", error);
  } finally {
    isLoading.value = false;
  }
};

// 控制弹窗是否可见
const isDialogVisible = ref(false);
// **点击艺术品**
const handleClick = (Id) => {
  if (Id) {
    artworkId.value = Id;
    isDialogVisible.value = true;
    window.history.pushState(null, '', `/artwork/${artworkId.value}`);
  }
};

const handleClose = async () => {
  isDialogVisible.value = false;
  window.history.back();
  await nextTick(); // 确保状态重置完成
  loadMore();
};



watch(
  () => ({
    createdBy: props.createdBy,
    name: props.name,
    subcategoryId: props.subcategoryId,
    isFavorite: props.isFavorite,
    tagName: props.tagName,
    paramDate: props.paramDate,
  }),
  async (newProps, oldProps) => {
      resetState();
      await nextTick();
      await loadMore(); // 🔹 立即加载第一页
    },{ deep: true }
);


// **初始化加载**
onMounted(() => {
  loadMore();
});
</script>

<style scoped lang="scss">
/* 确保弹窗本体不能滚动 */
/* 让 ElDialog 位置调整，不覆盖 header */
.custom-dialog {
  padding: 0px !important;
  top: 0px !important; /* ✅ 让窗口从 60px 处开始 */
  max-width: 90vw;
  height: calc(100vh - 60px); /* ✅ 让窗口填充但不超出 */
  overflow: hidden !important; /* ✅ 禁止窗口滚动 */
}

/* 让弹窗内容区域可以滚动 */
.custom-dialog .el-dialog__body {
  overflow-y: auto !important;
  max-height: calc(100vh - 120px); /* ✅ 让内容可滚动 */
  padding: 20px;
}

.art-list-container{
  padding: 10px;
}
.art-list {
  width: 100%;
  margin: 0 auto;
  padding-right: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(225px, 2fr)); /* 自适应列宽 */
  width: 100%;
  gap: 10px;

}

.grid-item {
  background-color: #1c1c1c;
  height: 225px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s;
  position: relative;
}

.grid-item:hover {
  transform: scale(1.01);
}

.item-detail {
  display: flex;
  justify-content: right;
  align-items: center;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  z-index: 2;
  color: #ffffff;
  text-shadow: 0 1px 2px rgb(0, 0, 0);
  transition: 0.5s ease;
}

.grid-item:hover .item-detail {
  transform: translateY(0);
  color: #ffffff;
  text-shadow: 0 0px 20px rgb(0, 0, 0);
}

.item-icon {
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-right: 10px;
}

.item-icon div {
  margin-left: 5px;
}

.item-image-skeleton {
  width: 100%;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.1);
}

.item-info-skeleton {
  padding: 10px;
}

.item-image {
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
}

.color-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8));
  border-radius: inherit;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.grid-item:hover .color-overlay {
  opacity: 1;
}

.item-info {
  position: absolute;
  display: flex;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  padding: 10px;
  color: #fff;
  text-align: left;
  transition: transform 0.5s ease, opacity 0.5s ease;
  transform: translateY(200%);
  z-index: 1;
  .item-author {
    margin-right: 10px;
  }
  .item-title {
    margin-bottom: 5px;
  }
}

.grid-item:hover .item-info {
  transform: translateY(0);
}

.item-info p {
  font-size: 0.9rem;
  margin: 0;
}

.item-info small {
  color: #ccc;
}
</style>