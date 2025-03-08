<template>
<div class="login">
    <div class="left-wrap">
      <left-view ></left-view>
    </div>
    <div class="right-wrap">
        <div class="top-right-wrap">
            <div class="btn theme-btn" @click="toggleTheme">
                <i class="iconfont-sys">
                    {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
                </i>
            </div>
        </div>

        <div class="header">
            <h1>ccsssss</h1>
        </div>
        
        <div class="login-wrap">
            <div class="form">
                <h3 class="title">欢迎登录艺术管理系统</h3>
                <p class="sub-title">输入您的账号和密码登录</p>
        
                <div class="input-wrap">
                    <el-input
                    placeholder="账号"
                    size="large"
                    v-model.trim="username"
                    />
                </div>

                <div class="input-wrap">
                    <el-input
                    placeholder="密码"
                    size="large"
                    type="password"
                    radius="8px"
                    autocomplete="off"
                    v-model.trim="password"
                    @keyup.enter="userlogin"
                    
                    />
                </div>

                <div class="drag-verify">
                    <div class="drag-verify-content">
                        <DragVerify
                            ref="dragVerify"
                            v-model:value="isPassing"
                            :width="width < 500 ? 328 : 438"
                            text="按住拖动滑块"
                            successText="验证成功"
                            :progressBarBg="getCssVariable('--el-color-primary')"
                            textColor="var(--art-gray-800)"
                            background="var(--art-gray-200)"
                            handlerBg="var(--art-main-bg-color)"
                            @pass="onPass"
                        />
                    </div>
                    <p class="error-text" :class="{ 'show-error-text': !isPassing && isClickPass }">请拖动滑块完成验证</p>
                </div>
                <div style="margin-top: 30px">
                <el-button
                    class="login-btn"
                    size="large"
                    type="primary"
                    @click="userlogin"
                    :loading="loading"
                >
                登录
                </el-button>
                </div>
                <div class="footer">
                </div>
            </div>
        </div>
    </div>
</div>

</template>
<script setup>
import LeftView from '@/components/Pages/Login/LeftView.vue'
import DragVerify from '@/components/From/DragVerify.vue'
import { getCssVariable } from '@/utils/utils'
import { ElMessage } from 'element-plus'
import {useUserStore} from '@/store/modules/userStore'

//使用设置存储
import { useSettingStore } from '@/store/modules/setting'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useSettingStore()
const isDark = computed(() => store.isDark)

// 用户登录
const userStore = useUserStore()

const username = ref()
const password = ref()
const isPassing = ref(false)
const isClickPass = ref(false)
const loading = ref(false)

const { width } = useWindowSize()

const formData = computed(() => ({
    username: username.value,
    password: password.value,
}));

const onPass = () => {}

const userlogin = async () => {
    if (!isPassing.value) {
        isClickPass.value = true
        return
    }
    loading.value = true
    try {
    userStore.adminLogin( formData.value ).then(() => {
        ElMessage.success('登录成功')
        toHome()
    })}
    finally {
    loading.value = false // 无论成功还是失败，都停止加载
    }
}

const toHome = () => {
    setTimeout(() => {
      router.push('/admin')
    }, 1000)
}

// 切换主题
import { useTheme } from '@/composables/useTheme.js'
//系统主题枚举
import { SystemThemeEnum } from '@/enums/appEnum'



const toggleTheme = () => {
    let { LIGHT, DARK } = SystemThemeEnum
    useTheme().setSystemTheme( useSettingStore().systemThemeType === LIGHT ? DARK : LIGHT )
}
</script>
<style lang="scss" scoped>
    @use './index';
</style>