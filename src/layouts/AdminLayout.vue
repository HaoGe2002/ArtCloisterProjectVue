<template>
    <div class="admin-layout">
      <header class="admin-header">
        <!-- 后台头部导航等内容 -->
      </header>
      <aside class="admin-sidebar">
        <!-- 后台侧边栏菜单 -->
      </aside>
      <main class="admin-content">
        <!-- 后台页面具体内容通过 <router-view> 展示 -->
        <router-view />
      </main>
      <footer class="admin-footer">
        <!-- 后台页脚 -->
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminLayout'
  };
  </script>
  
  <style scoped>
  /* 添加后台布局样式 */
  .admin-layout {
    display: grid;
    grid-template-areas:
      "header header"
      "sidebar content"
      "footer footer";
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
  }
  .admin-header {
    grid-area: header;
  }
  .admin-sidebar {
    grid-area: sidebar;
    background: #2d3a4b;
    color: #fff;
  }
  .admin-content {
    grid-area: content;
    padding: 20px;
  }
  .admin-footer {
    grid-area: footer;
    text-align: center;
    padding: 10px;
    background: #f0f2f5;
  }
  </style>
  