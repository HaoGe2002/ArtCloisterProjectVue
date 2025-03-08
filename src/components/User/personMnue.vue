<template>
  <el-tabs v-model="activeMainTab" type="card" class="person-mnue" lazy>
    <!-- 用户收藏 -->
    <el-tab-pane label="收藏" name="favorites">
      <template v-if="activeMainTab === 'favorites'">
        <DigitArtList v-if="categoryId === 2" :isFavorite="true" :createdBy="userId" :categoryId="2" />
      </template>
    </el-tab-pane>

    <!-- 创建的艺术品 -->
    <el-tab-pane label="创作" name="created">
      <template v-if="activeMainTab === 'created'">
        <DigitArtList v-if="categoryId === 2" :categoryId="2" :createdBy="userId" />
      </template>
    </el-tab-pane>

    <!-- 编辑中（未上架）的艺术品 -->
    <el-tab-pane v-if="isCurrentUser" label="编辑" name="editing">
      <template v-if="activeMainTab === 'editing'">
        <editingArtList :userId="userId" style="width: 80%; margin: 0 auto" />
      </template>
    </el-tab-pane>

    <el-tab-pane v-if="isCurrentUser" label="以出售" name="order">
      <template v-if="activeMainTab === 'order'">
        <orderList :userId="userId" style="width: 80%; margin: 0 auto" />
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DigitArtList from '@/components/Pages/artlist/digitArtList.vue';
import physicalArtList from '@/components/Pages/artlist/physicalArtList.vue';
import { useSettingStore } from '@/store/modules/setting';


const props = defineProps({
  userId: { type: Number, default: null },
  isCurrentUser: { type: Boolean, default: false }
});




const Setstore = useSettingStore();
const categoryId = ref(Setstore.setCategories);
const activeMainTab = ref('favorites');

const route = useRoute();
const router = useRouter();

// onMounted中检查是否存在tab参数，自动切换选项卡
onMounted(() => {
  if (route.query.tab) {
    activeMainTab.value = route.query.tab;
  }
});

// 当store中的类别发生变化时更新
watch(() => Setstore.setCategories, (newVal) => {
  categoryId.value = newVal;
});

// 当选项卡变化时，同时更新路由查询参数
watch(activeMainTab, (newTab) => {
  router.replace({ query: { ...route.query, tab: newTab } });
});
</script>

<style scoped>
.person-mnue {
  margin-top: 40px;
  padding: 0 5px;
}
</style>
