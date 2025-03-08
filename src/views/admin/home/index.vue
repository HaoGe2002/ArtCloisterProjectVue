<template>
  <div class="admin-layout">
    <AdminHeader />
    <aside class="admin-sidebar">
      <SidebarMenu />
    </aside>
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import AdminHeader from '@/components/admin/AdminHeader.vue';
import SidebarMenu from '@/components/admin/SidebarMenu.vue'
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* 防止外层滚动 */
}

/* .admin-sidebar {
} */

.admin-content {
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto; /* 使右侧内容区域可滚动 */
  margin-top: 60px;
  margin-left: 200px; /* 保证内容区从菜单开始 */
}
</style>
