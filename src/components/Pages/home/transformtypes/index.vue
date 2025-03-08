<template>
  <div class="fixed-tabs" v-if="isDataLoaded">
    <div
      v-for="parentType in filteredParentTypes"
      :key="parentType.categoryId"
      class="tab"
      :class="{ active: activeTab === parentType.categoryId }"
      @click="switchTab(parentType.categoryId)"
    >
      {{ parentType.categoryName }}
    </div>
  </div>
  <div v-else class="loading">加载中...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSettingStore } from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

const activeTab = ref(null); // 当前选中的 Tab
const store = useSettingStore();
const parentTypes = computed(() => store.Categories);
const emit = defineEmits(['switch']);
const isDataLoaded = ref(false);

// 过滤掉 null 或 undefined 的元素
const filteredParentTypes = computed(() => parentTypes.value.filter(type => type !== null && type !== undefined));

// 初始化，加载缓存或默认选中第一个 Tab
onMounted(() => {
  store.getCategories().then(() => {
    isDataLoaded.value = true;

    if (store.setCategories !== null) {
      switchTab(store.setCategories);
    } else if (filteredParentTypes.value.length > 0) {
      switchTab(filteredParentTypes.value[0].categoryId);
    } else {
      ElMessage.error('没有可用的分类数据');
    }

  }).catch(err => {
    console.error('获取分类数据失败:', err);
    isDataLoaded.value = true;
    if (filteredParentTypes.value.length > 0) {
      switchTab(filteredParentTypes.value[0].categoryId);
    } else {
      ElMessage.error('没有可用的分类数据');
    }
  });
});

// 切换 Tab
const switchTab = (tab) => {
  activeTab.value = tab; // 更新当前选中 Tab
  store.settingCategories(tab); // 缓存到 LocalStorage
  emit('switch', tab); // 通知父组件
};
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;

.fixed-tabs {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  background-color: #181818;
  border-radius: 40px;
  padding: 5px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.tab {
  cursor: pointer;
  padding: 10px;
  margin: 5px;
  color: #ffffff;
  border-radius: 25px;
  transition: background-color 0.3s;
}

.tab.active {
  background-color: #ffffff;
  color: var(--art-dark);
}

.tab:not(.active):hover {
  background-color: #333;
}

.loading {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #181818;
  color: #ffffff;
  border-radius: 40px;
  z-index: 999;
}
</style>