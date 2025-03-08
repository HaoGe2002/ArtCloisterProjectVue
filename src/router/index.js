import { createRouter, createWebHistory } from 'vue-router';
import { useSettingStore } from '@/store/modules/setting'

//后台管理
const AdminLayout = () => import('@/views/admin/home/index.vue');
const AdminLogin = () => import('@/views/admin/login/index.vue');



const routes = [{
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'user-manage', component: () => import('@/views/admin/UserManage/index.vue') },
      { path: 'audit-manage', component: () => import('@/views/admin/AuditManage/index.vue') },
      { path: 'artwork-manage', component: () => import('@/views/admin/ArtworkManage/index.vue') },
      { path: 'frame-manage', component: () => import('@/views/admin/FrameManage/index.vue') },
      { path: 'banner-manage', component: () => import('@/views/admin/BannerManage/index.vue') },
      { path: 'type-manage', component: () => import('@/views/admin/TypeManage/index.vue') },
      { path: 'order-manage', component: () => import('@/views/admin/OrderManage/index.vue') },
    ]},
    {
      path: '/search',
      name: 'Search',
      component: () => import('@/views/search/index.vue'),
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('@/views/order/index.vue'),
    },
    {
      path: '/cart',
      name: 'Cart',
      component: () => import('@/views/cart/CartView.vue'),
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      component: AdminLogin,
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
    },

    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/register/index.vue'),
    },
    {
      path: '/shelves',
      name: 'Shelves',
      component: () => import('@/views/shelvesArt/index.vue'),
    },
    {
      path: '/virtual',
      name: 'Virtual',
      component: () => import('@/views/shelvesArt/virtual/index.vue'),
    },
    {
      path: '/physical/:artworkId?',
      name: 'Physical',
      component: () => import('@/views/shelvesArt/physical/index.vue'),
      props: route => ({ artworkId: route.params.artworkId || null }) // 确保 `artworkId` 可选
    },
    
    {
      path: '/personal/:userId',
      name: 'Personal',
      component: () => import('@/views/personal/index.vue'),
      props: true // 允许组件通过 `props` 获取路由参数
    },
    {
      path: "/:pathMatch(.*)*",
      name:'404',
      component: () => import('@/views/exception/404.vue'),
    },

    {
      path: "/artwork/:artworkId",
      name:'Artwork',
      component: () => import('@/components/Pages/artDetail/digitArtDetail.vue'),
      props: true // 允许组件通过 `props` 获取路由参数
    },
    {
      path: "/edit_user",
      name:'EditUser',
      component: () => import('@/views/editUser/index.vue'),
    }
    ];
  //注册路由
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  
  import { useTheme } from '@/composables/useTheme'
  // 设置登录注册页面主题
  function setSystemTheme(){
    useTheme().setSystemTheme(useSettingStore().systemThemeType)
  }
  router.beforeEach(async (to, next) => {
    setSystemTheme()
    console.log(to)
     // 设置登录注册页面主题
    // setSystemTheme(to)
  })
  export default router;