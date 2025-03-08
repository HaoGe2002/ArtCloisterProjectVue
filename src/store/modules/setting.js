import { defineStore } from "pinia";
import { SystemThemeEnum } from '@/enums/appEnum'
import { getSysStorage, saveUserData } from '@/utils/storage'
import { getCategories,getSubCategories } from '@/api/type/type'
import { getArtworkTags, artworkInsertArtworkTags } from '@/api/artwork/tags'

export const useSettingStore = defineStore('settingStore',{
    //变量
    state: () => ({
        systemThemeType: SystemThemeEnum.LIGHT,
        Categories: [],
        SubCategories: [],
        setCategories:0,
    }),
    //
    getters: {
        // 是否为暗黑模式
        isDark() {
            return this.systemThemeType === SystemThemeEnum.DARK
        },
    },
    actions: {

        //请求获取全部艺术品大类
        getCategories() {
            return new Promise((resolve, reject) => {
            getCategories().then(res => {
                const data = res
                this.Categories = data.Categories
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
        },

        //请求获取艺术品类型
        getSubcategories() {
        return new Promise((resolve, reject) => {
            getSubCategories().then(res => {
                const data = res.data
                this.SubCategories = data
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
        },
        // 初始化state
        initState() {
            let sys = getSysStorage()
            if (sys) {
                sys = JSON.parse(sys)
                const { setting } = sys.user
                this.systemThemeType = setting.systemThemeType || SystemThemeEnum.LIGHT
                this.setCategories = setting.setCategories || 0
                // this.Categories = setting.Categories || []
            }
        },
        setGlopTheme(theme){
            this.systemThemeType = theme
        },
        settingCategories(Categorie){
            this.setCategories = Categorie
        },
    }
})