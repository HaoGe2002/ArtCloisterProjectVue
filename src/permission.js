import router from './router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'
import { useUserStore } from '@/store/modules/userStore'
import {getInfo} from '@/api/login'
import { isAdmin } from '@/api/admin/admin'

NProgress.configure({ showSpinner: false })

const whiteList = ['/', '/login', '/register', '/404', '/admin/login'] // 免登录白名单

const checkUserInfo = async (to, next) => {
  const userStore = useUserStore()
  if (!userStore.info.userId) {
    isRelogin.show = true
    try {
      await userStore.getInfo()
      isRelogin.show = false
      next()
    } catch (err) {
      userStore.logOut().then(() => {
        ElMessage.error(err)
        next(`/login?redirect=${to.fullPath}`)
      })
    }
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  NProgress.start() // 开始加载进度条

  const isLogin = useUserStore().isLogin

  // 如果已经登录
  if (isLogin) {
    // 已登录不允许访问 /login 或 /register，跳转到主页
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果是管理员页面，进行后端验证
        if (to.path.startsWith('/admin')) {
          isAdmin().then (res => {
            if(res.data){
              next()
            }else{
              next(`/admin/login`);
              NProgress.done()
              ElMessage.error('您不是管理员，无法访问此页面')  
            }
          }).catch(err => {
            next(`/admin/login`);
            ElMessage.error('出错了')  
          })
        } else {

          if(!useUserStore().info.userId){
            isRelogin.show = true
            useUserStore().getInfo().then(() => {
                isRelogin.show = false
            }).catch(err => {
                useUserStore().logOut().then(() => {
                    ElMessage.error(err)
                    next(`/login`);
                    console.log(err + '登录信息已过期，请重新登录')
                })
            })
          }
          next()
        }
    }

    // 如果是去 /admin/login，先登出
    if (to.path === '/admin/login') {
      useUserStore().logOut().then(() => {
        next()
      })
    }
    
  } else {
    // 未登录，处理访问白名单之外的页面
    if (to.path === '/admin/login') {
      next()
      return
    }

    if (to.path.startsWith('/admin')){
      next(`/admin/login`)
    }

    if (whiteList.includes(to.path) || to.path.startsWith('/personal/') || to.path.startsWith('/artwork/')) {
      next() // 允许访问白名单页面
    } else {
      ElMessage.warning('请先登录')
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束进度条
})
