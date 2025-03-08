import { defineStore } from "pinia";
import { useSettingStore } from './setting'
import { getToken, setToken, removeToken, } from '@/utils/auth'
import {toFixedTwo} from '@/utils/utils'
import { login, logout, getInfo } from '@/api/login'
import { adminLogin} from '@/api/admin/login'

import {getUser} from '@/api/user/user'
import defAva from '@/assets/img/avatar/avatar.png'
import { getSysStorage } from '@/utils/storage'
import { useRouter } from 'vue-router'

const router = useRouter()


export const useUserStore = defineStore("userStore",{

    state:() =>({
        info: {},
        isLogin: false,
        searchHistory:[]
    }),
    getters: {
        getUserInfo(){
            return this.info
        },
        getUserId(){
            return this.info.userId
        },
        getSettingState() {
            return useSettingStore().$state
        },
    },
    actions: {
        initState() {
            let sys = getSysStorage()
            if (sys) {
                sys = JSON.parse(sys)
                const { info, isLogin, searchHistory } = sys.user
                this.info = info || {}
                this.isLogin = isLogin || false
                this.searchHistory = searchHistory || []
            }
        },
        setLoginStatus(isLogin) {
            this.isLogin = isLogin
        },

        adminLogin(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
              adminLogin(username, password).then(res => {

                setToken(res.token)
                this.info.token = res.token
                this.setLoginStatus(true);
                resolve()
              }).catch(error => {
                reject(error)
              })
            })
        },

        login(userInfo) {
            const username = userInfo.username.trim()
            const password = userInfo.password
            return new Promise((resolve, reject) => {
              login(username, password).then(res => {

                setToken(res.token)
                this.info.token = res.token
                this.setLoginStatus(true);
                resolve()
              }).catch(error => {
                reject(error)
              })
            })
        },

        getUser(userId){
            return new Promise((resolve, reject) => {
                getUser(userId).then(res => {
                const user = res.data
                user.avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
                resolve(user)
                }).catch(error => {
                reject(error)
                })
            })
        },
        // 获取用户信息
        getInfo() {
            return new Promise((resolve, reject) => {
            getInfo().then(res => {
                const user = res.user
                user.avatar = (user.avatar == "" || user.avatar == null) ? defAva : import.meta.env.VITE_APP_BASE_API + user.avatar;
                user.balance = toFixedTwo(user.balance)
                this.info.avatar = user.avatar
                this.info.userId = user.userId
                this.info.nickname = user.nickname
                resolve(user)
            }).catch(error => {
                reject(error)
            })
        })},
        logOut() {
            return new Promise((resolve, reject) => {
                logout(this.info.token).then(() => {
                    this.info = {}
                    this.isLogin = false
                    removeToken()
                    resolve()
                    this.saveUserData()
                    sessionStorage.removeItem('iframeRoutes')
                    router.push('/login')
                }).catch(error => {
                    reject(error)
                })
            })

        },

        // 用户数据持久化存储
        saveUserData() {
            saveStoreStorage({
                user: {
                    info: this.info,
                    isLogin: this.isLogin,
                    setting: this.getSettingState
                }
            })
        }
    }
})

function initVersion(version) {
    const vs = localStorage.getItem('version')
    if (!vs) {
        localStorage.setItem('version', version)
    }
}

// 数据持久化存储
function saveStoreStorage(newData){
    const version = import.meta.env.VITE_VERSION
    initVersion(version)
    const vs = localStorage.getItem('version') || version
    const storedData = JSON.parse(localStorage.getItem(`sys-v${vs}`) || '{}')
      // 合并新数据与现有数据
    const mergedData = { ...storedData, ...newData }
    localStorage.setItem(`sys-v${vs}`, JSON.stringify(mergedData))
}