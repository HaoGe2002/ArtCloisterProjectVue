<template>
      <div class="drawer-content">
        <div class="user-name">
            <el-avatar 
            style=" cursor: pointer; 
            margin-right: 3px;" 
            :size="40" 
            :src="squareUrl" 
            />
            <div class="menu-section">
                <span class="menu-header">浩克</span>
            </div>
        </div>
        <div class="menu-item">
          <span>用户中心</span>
          <el-icon class="icon"><UserFilled /></el-icon>
        </div>

        <div class="menu-item">
          <span>用户订单</span>
          <el-icon class="icon"><Tickets /></el-icon>
        </div>
        
        <div class="menu-item">
          <span>购物车</span>
          <el-icon class="icon"><ShoppingCart /></el-icon>
        </div>
        <hr class="divider" />

        <div class="menu-item" @click="transformMode">
          <span>主题</span>
          <DarkModeToggle ref="darkModeRef"/>
        </div>

        <div class="menu-item">
          <span>退出登录</span>
          <el-icon><CaretRight /></el-icon>
        </div>

      </div>
</template>
  
<script setup>
  import { ref } from "vue";
  import UserAvatar from "./UserAvatar.vue";
  import DarkModeToggle from "./DarkModeToggle.vue";
  const squareUrl = ref("https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png");

  const darkModeRef = ref(null);

  const transformMode = () => {
  if (darkModeRef.value) {
    darkModeRef.value.toggleTheme(); // ✅ 直接调用子组件方法
  }
};
</script>
  
<style scoped lang="scss">
.drawer-content{
    padding: 10px;
}
.user-name {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

}
/* 菜单标题 */
.menu-header {
  font-size: 16px;
  font-weight: bold;
  color: var(--el-text-color-primary);
  padding: 10px 0;
}

/* 菜单项 */
.menu-item {
    border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--el-text-color-primary);
  transition: background 0.3s;
}

.menu-item:hover {
  background: var(--el-color-primary-light-9);
}

/* 分割线 */
.divider {
  border: none;
  height: 1px;
  background: var(--el-border-color);
  margin: 10px 0;
}
</style>