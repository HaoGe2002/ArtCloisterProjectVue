<template>
  <div class="user-menu" @click="toggleMenu">
    <el-avatar 
      v-if="isLoggedIn" 
      style="cursor: pointer; margin-right: 3px;" 
      :size="35" 
      :src="userInfo.avatar"
    />
    <el-avatar 
      v-else 
      style="cursor: pointer; margin-right: 3px;" 
      :size="35" 
      :src="userInfo.avatar"
    />

    <!-- 下拉菜单 -->
    <transition name="fade">
      <div v-show="isMenuOpen" class="dropdown-menu" @click.stop>
        <!-- ✅ 已登录时显示完整菜单 -->
        <template v-if="isLoggedIn">
          <div class="dropdown-header">
            <span class="user-email">{{ userInfo.nickname }}</span>
          </div>
          <div class="dropdown-item" @click="goToUserCenter">
            用户中心
            <el-icon class="icon"><UserFilled /></el-icon>
          </div>
          <div class="dropdown-item" @click="gotoOrder">
            用户订单
            <el-icon class="icon"><Tickets /></el-icon>
          </div>
          <div class="dropdown-item" @click="gotoCart">
            购物车
            <el-icon class="icon"><ShoppingCart /></el-icon>
          </div>
          <hr class="divider" />
          <div class="dropdown-item" @click="transformMode">
            主题
            <DarkModeToggle ref="darkModeRef" />
          </div>
          <hr class="divider" />
          <div class="dropdown-item" @click="handleLogout">
            退出登录
            <el-icon><CaretRight /></el-icon>
          </div>
          <hr class="divider" />
          <div class="upgrade-btn" @click="shelvesArt">上架艺术品</div>
        </template>

        <!-- ❌ 未登录时只显示「登录」「注册」「切换主题」 -->
        <template v-else>
          <div class="dropdown-item" @click="toLogin">
            登录
            <el-icon class="icon"><CaretRight /></el-icon>
          </div>
          <div class="dropdown-item" @click="goToRegister">
            注册
            <el-icon class="icon"><CaretRight /></el-icon>
          </div>
          <hr class="divider" />
          <div class="dropdown-item" @click="transformMode">
            主题
            <DarkModeToggle ref="darkModeRef" />
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import DarkModeToggle from "./DarkModeToggle.vue";
import { UserFilled, Tickets, ShoppingCart, CaretRight } from "@element-plus/icons-vue";
import {useUserStore} from '@/store/modules/userStore'
import { useRouter } from 'vue-router'
const router = useRouter()

const userStore = useUserStore()
// 用户登录状态
const isLoggedIn = computed(() => userStore.isLogin) 
const userInfo = computed(() => userStore.info)

const squareUrl = ref("https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png");
const isMenuOpen = ref(false);
const darkModeRef = ref(null);

const transformMode = () => {
  if (darkModeRef.value) {
    darkModeRef.value.toggleTheme(); // ✅ 直接调用子组件方法
  }
};

const goToUserCenter = () => {
  if (isLoggedIn.value) {
    router.push(`/personal/${userInfo.value.userId}`);
  } else {
    ElMessage.warning('请先登录');
    router.push('/login');
  }
};

// 切换菜单显示状态
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// 监听点击其他地方隐藏菜单
const handleClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest('.user-menu')) {
    isMenuOpen.value = false;
  }
};

const shelvesArt = (userId) => {
  router.push(`/personal/${userInfo.value.userId}?tab=editing`)
}

const gotoCart = () => {
  router.push('/cart')
}

const gotoOrder = () => {
  router.push('/order')
}
// 处理退出登录
const handleLogout = () => {
  userStore.logOut();
};

const toLogin = () => {
  router.push('/login')
}

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register')
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* 透明度动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 40px;
  width: 250px;
  background: var(--art-bg-color);
  border-radius: 8px;
  padding: 12px;
  box-shadow: var(--art-box-shadow-xs);
  z-index: 1000;
  border: 1px solid var(--art-border-color);
}

/* 用户邮箱 */
.dropdown-header {
  font-weight: bold;
  padding: 8px 12px;
  color: var(--menu-text);
}

/* 菜单项 */
.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  color: var(--menu-text);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
}

.dropdown-item:hover {
  background: var(--el-border-color);
  color: var(--menu-hover-text);
}

/* 图标 */
.icon {
  font-size: 16px;
}

/* 分割线 */
.divider {
  border: none;
  height: 1px;
  background: var(--el-border-color);
  margin: 8px 0;
}

/* 退出按钮 */
.logout {
  color: var(--el-color-danger);
}

/* 升级按钮 */
.upgrade-btn {
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: var(--menu-hover-text);
  transition: 0.3s;
}

.upgrade-btn:hover {
  background: var(--art-light-active);
  color: var(--art-text-gray-900);
}
</style>
