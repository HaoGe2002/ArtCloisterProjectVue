<template>
    <div class="login register">
        <div class="left-wrap">
            <left-view></left-view>
        </div>
        <div class="right-wrap">
            <div class="header">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#iconsys-zhaopian-copy"></use>
                </svg>
                <h1>艺术回廊</h1>
            </div>
        
        <div class="login-wrap">
            <div class="form">
                <h3 class="title">注册账户</h3>
                <p class="sub-title">欢迎加入我们，请填写以下信息完成注册</p>
                <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
                    <el-form-item prop="username">
                        <el-input
                            v-model.trim="formData.username"
                            placeholder="请输入账号"
                            size="large"
                        />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input
                            v-model.trim="formData.password"
                            placeholder="请输入密码"
                            size="large"
                            type="password"
                            autocomplete="off"
                        />
                    </el-form-item>

                    <el-form-item prop="confirmPassword">
                        <el-input
                            v-model.trim="formData.confirmPassword"
                            placeholder="请再次输入密码"
                            size="large"
                            type="password"
                            autocomplete="off"
                            @keyup.enter="userRegister"
                        />
                    </el-form-item>

                    <el-form-item prop="agreement">
                        <el-checkbox v-model="formData.agreement">
                            我已阅读并同意
                            <router-link
                                class="custom-text"
                                style="color: var(--main-color); text-decoration: none"
                                to="/privacy-policy"
                            >
                                《隐私政策》
                            </router-link>
                        </el-checkbox>
                    </el-form-item>

                    <div style="margin-top: 15px">
                        <el-button
                            class="register-btn"
                            size="large"
                            type="primary"
                            @click="userRegister"
                            :loading="loading"
                        >
                            注册
                        </el-button>
                    </div>

                    <div class="footer">
                        <p>
                            已有账户?
                            <router-link class="custom-text" to="/login">
                                登录
                            </router-link>
                        </p>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import LeftView from '@/components/Pages/Login/LeftView.vue'
import { ElMessage } from 'element-plus'
import { register } from '@/api/login'
import { useRouter } from 'vue-router'
const router = useRouter()

const formRef = ref(null)
const loading = ref(false)
// 数据
const formData = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    agreement: false
})

// 验证密码
const validatePass = (rule, value, callback) => {
    if (value === '') {
        callback(new Error("请输入密码"))
    } else {
        if (formData.confirmPassword !== '') {
            nextTick(() => {
                formRef.value?.validateField('confirmPassword')
            })
        }
        callback()
    }
}

// 验证确认密码
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error("请输入确认密码"))
    } else if (value !== formData.password) {
        callback(new Error("密码不一致！"))
    } else {
        callback()
    }
}

// 验证规则
const rules = reactive({
    username: [
        { required: true, message: "请输入账号", trigger: 'blur' },
        { min: 3, max: 20, message: "账号格式不规范", trigger: 'blur' }
    ],
    password: [
        { required: true, validator: validatePass, trigger: 'blur' },
        { min: 6, message: "密码最少6位数", trigger: 'blur' }
    ],
    confirmPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
    agreement: [{
        validator: (rule, value, callback) => {
            if (!value) {
                callback(new Error("请阅读并同意隐私政策"))
            } else {
                callback()
            }
        },
        trigger: 'change'
    }]
})

// 注册函数（假设你需要一个注册函数）

const userRegister = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
        loading.value = true

        register(formData).then(() => {
            ElMessage.success('注册成功')
            toLogin()
        })
    }catch (error) {
        console.log('验证失败', error)
    }finally{
        loading.value = false
    }
}


const toLogin = () => {
    setTimeout(() => {
      router.push('/login')
    }, 1000)
}
</script>

<style lang="scss" scoped>
@use '../login/index' as login;
@use './index' as register;
</style>