import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/userStore'
import { useSettingStore } from '@/store/modules/setting'

// 初始化本地数据
export function initState() {
  
  if (getLocalStorageData() || isLocalStorageEmpty()){
    const settingStore = useSettingStore()
    const userStore = useUserStore()
    
    userStore.initState()
    settingStore.initState()
  }
  // console.log(isLocalStorageEmpty())
}
// 获取系统存储数据
export function getSysStorage() {
    const version = localStorage.getItem('version') || import.meta.env.VITE_VERSION
    return localStorage.getItem(`sys-v${version}`)
}
// 获取本地存储数据
function getLocalStorageData() {
    return JSON.parse(getSysStorage() || '{}')
  }

// 验证本地存储数据并处理异常
export function validateStorageData() {
  if (location.href.includes('/login')) return true
}

// 本地存储是否为空
function isLocalStorageEmpty() {
    return Object.keys(getLocalStorageData()).length === 0
  }

// 将 vuex 中的数据保存到 localStorage 中（在即将离开页面(刷新或关闭)时执行）
export function saveUserData() {
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const eventType = isiOS ? 'pagehide' : 'beforeunload'
  
    window.addEventListener(eventType, () => {
      useUserStore().saveUserData()
    })
  }