<template>
  <el-menu
    default-active="$route.path"
    router
    class="el-menu-vertical"
    background-color="#2d3a4b"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <!-- Logo 和标题 -->
    <div class="menu-header">
      <img src="@/assets/img/artType/logo.png" alt="Logo" class="logo" />
      <span class="title">艺术回廊管理</span>
    </div>

    <!-- 用户管理 -->
    <el-sub-menu index="1">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>用户管理</span>
      </template>
      <el-menu-item index="/admin/user-manage">用户管理</el-menu-item>
    </el-sub-menu>

    <!-- 艺术品管理 -->
    <el-sub-menu index="2">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>艺术品管理</span>
      </template>
      <el-menu-item index="/admin/artwork-manage">艺术品管理</el-menu-item>
      <el-menu-item index="/admin/type-manage">类型管理</el-menu-item>
      <el-menu-item index="/admin/frame-manage">裱框管理</el-menu-item>
    </el-sub-menu>

    <!-- 交易管理 -->
    <el-sub-menu index="3">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>交易管理</span>
      </template>
      <el-menu-item index="/admin/order-manage">订单管理</el-menu-item>
      <!-- <el-menu-item index="/admin/flow-record">流水记录</el-menu-item> -->
    </el-sub-menu>

    <!-- 系统日志 -->
    <!-- <el-sub-menu index="4">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统日志</span>
      </template>
      <el-menu-item index="/admin/system-log">日志记录</el-menu-item>
    </el-sub-menu> -->
  </el-menu>
</template>

<script setup>
import { Setting } from '@element-plus/icons-vue'
</script>

<style scoped>
.el-menu-vertical {
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  border-right: none;
  z-index: 999;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 15px;
  background: #1f2d3d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
</style>
