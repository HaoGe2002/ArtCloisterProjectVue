<template>

  <el-header class="header">
    <!-- LOGO（仅在大屏幕显示） -->
    <div v-if="!isMobile" class="logo" @click="$router.push('/')">
      <img src="../../../assets/img/artType/logo.png" alt="Logo" class="logo-img"/>
      <span style="font-size: 24px;">艺术回廊</span>
          <!-- 导航菜单 -->
    </div>

    <!-- 移动端菜单切换按钮 -->
    <el-icon v-if="isMobile" class="menu-toggle" @click="showMobileMenu = true" size="20" style="cursor: pointer;">
        <Expand />
    </el-icon>

    <!-- 移动端抽屉菜单 -->
    <!-- <el-drawer 
      v-if="isMobile"
      v-model="showMobileMenu"
      title="菜单"
      direction="ltr"
      size="90%"
      class="custom-drawer">
      <UserDrawer/>
    </el-drawer> -->

    <el-drawer
      v-if="isMobile"
      v-model="showMobileNotice"
      title="通知"
      direction="btt"
      size="70%"
      class="custom-drawer"
    >
      <Notice
      :isMobile="isMobile" 
      :list = "true"
      />
    </el-drawer>

    <div class="right-area">
      <!-- 搜索框 -->

<!-- 搜索框 -->
      <div class="search-box" @click="$router.push('/search')" style="cursor: pointer;">
        <el-icon class="icon">
          <Search />
        </el-icon>
        <input placeholder="输入关键字搜索..." class="search-input" readonly />
        <span class="shortcut">Ctrl K</span>
      </div>

      <!-- 通知 -->
      <Notice 
      v-if="userStore.isLogin"
      @click="showMobileNotice = true" 
      :isMobile="isMobile" 
      />
      <!-- 用户头像 -->
      <UserAvatar 
      v-show="!isMobile"/>
    </div>
  </el-header>
  <!-- <el-header class="header" style="  border-bottom: 1px solid var(--el-border-color);">
    
  </el-header> -->
  <div v-if="!props.noPlaceholder" class="placeholder"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import {useUserStore} from "@/store/modules/userStore"
import UserAvatar from './UserAvatar.vue';
import Notice from './Notice.vue';
// import UserDrawer from './UserDrawer.vue';
import { Search,Expand } from '@element-plus/icons-vue';

const userStore = useUserStore();

const props = defineProps({
  noPlaceholder: {type: Boolean, required: false}
});

// 移动端状态
const isMobile = ref(window.innerWidth < 768);
const showMobileMenu = ref(false);
const showMobileNotice = ref(false);

// 监听窗口大小变化
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
  if (!isMobile.value) {
    showMobileMenu.value = false; // PC 端自动关闭抽屉
  }
};

// 选择菜单项
const selectItem = (index) => {
  activeIndex.value = index;
  showMobileMenu.value = false; // 选择后关闭抽屉
};

// 组件挂载时添加监听器
onMounted(() => {
  window.addEventListener("resize", handleResize);
});

// 组件销毁时移除监听器
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped lang="scss">
.placeholder{
  height: 60px;
}
/* 头部样式 */
.header {
  position: fixed;
  width: 100%;
  height: 60px; /* 确保与占位符高度一致 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 25px;
  background-color: var(--el-bg-color);
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000 !important; /* ✅ 确保 header 在最上层 */
  pointer-events: auto !important; /* ✅ 确保 header 可交互 */
}

/* 右侧区域 */
.right-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 搜索框 */
.search-box {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--el-border-color);
  border-radius: 20px;
  padding: 8px 12px;
  width: 280px;
  gap: 8px;
  backdrop-filter: blur(10px);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
}

.shortcut {
  background-color: var(--el-border-color);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--el-text-color-primary);
}
.logo{
  display: flex;
  align-items: center;
  cursor: pointer;
}
.logo-img {
  width: 40px;
  height: 40px;

}
/* 移动端适配 */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  .logo {
    display: none;
  }
}
</style>
