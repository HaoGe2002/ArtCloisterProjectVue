<template>
    <header class="admin-header">
      <div class="header-right">
        <el-dropdown trigger="click">
          <span class="user-info">
            <el-avatar :size="40" :src="userAvatar" class="user-avatar" />
            <span class="username">{{ username }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToProfile">
                <el-icon><User /></el-icon> 个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="changePassword">
                <el-icon><Edit /></el-icon> 修改密码
              </el-dropdown-item>
              <el-dropdown-item @click="toggleTheme">
                <el-icon><Edit /></el-icon> 切换主题
              </el-dropdown-item>
              <el-dropdown-item divided @click="logout">
                <el-icon><SwitchButton /></el-icon> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { User, ArrowDown, Edit, SwitchButton } from '@element-plus/icons-vue'
  
  // 获取管理员信息（这里可以改为 Vuex/Pinia）
  const username = ref('管理员') // 默认名称
  const userAvatar = ref('https://via.placeholder.com/40') // 默认头像（可换成实际头像地址）
  
  const router = useRouter()
  
  onMounted(() => {
    // 这里可以从 localStorage 或 Vuex/Pinia 获取用户名和头像
    const storedUser = JSON.parse(localStorage.getItem('adminUser'))
    if (storedUser) {
      username.value = storedUser.name || '管理员'
      userAvatar.value = storedUser.avatar || 'https://via.placeholder.com/40'
    }
  })
  
  const goToProfile = () => {
    router.push('/admin/profile') // 个人中心页面
  }
  
  const changePassword = () => {
    router.push('/admin/change-password') // 修改密码页面
  }
  
  const logout = () => {
    // 退出登录逻辑（清除用户信息，跳转到登录页）
    localStorage.removeItem('adminUser')
    console.log('退出登录')
    router.push('/admin/login')
  }

  // 切换主题
import { useTheme } from '@/composables/useTheme.js'
//系统主题枚举
import { SystemThemeEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'


const toggleTheme = () => {
    let { LIGHT, DARK } = SystemThemeEnum
    useTheme().setSystemTheme( useSettingStore().systemThemeType === LIGHT ? DARK : LIGHT )
}
  </script>
  
<style scoped>
  .admin-header {
    position: fixed;
    top: 0;
    height: 60px;
    background: #1f2d3d;
    color: #fff;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: end;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 500;
  }
  
  .header-right {
    display: flex;
    align-items: center;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
  }
  
  .user-avatar {
    margin-right: 10px;
  }
  
  .username {
    font-size: 14px;
    margin-right: 5px;
  }
</style>
  