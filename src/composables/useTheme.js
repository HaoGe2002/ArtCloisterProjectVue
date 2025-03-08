//系统主题枚举
import { SystemThemeEnum } from '@/enums/appEnum'
import { getDarkColor, getLightColor } from '@/utils/color'
import { useSettingStore } from '@/store/modules/setting'
export function useTheme() {
    const settingStore = useSettingStore()

    const setSystemTheme = (theme) => {
        const el = document.getElementsByTagName('html')[0]
        // const isDark = theme === SystemThemeEnum.DARK
        
        // 设置按钮颜色加深或变浅
        // const primary = settingStore.systemThemeColor
        el.setAttribute('class',theme)
        settingStore.setGlopTheme(theme)
    }


    return {
        setSystemTheme
    }
}