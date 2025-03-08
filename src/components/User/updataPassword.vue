<template>
    <div class="profile-container">
      <h2>修改密码</h2>
      <el-form 
        ref="passwordFormRef" 
        :model="passwordData" 
        :rules="passwordRules" 
        label-position="top"
        style="margin-top: 10px;"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordData.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordData.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordData.confirmPassword" type="password" show-password />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="enableEdit">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script setup>
import {updateUserPassword} from '@/api/user/user.js';
import {ElMessage} from 'element-plus';
const formRef = ref(null);

const passwordData = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
})
const enableEdit = () => {

    if (passwordData.newPassword !== passwordData.confirmPassword) {
        ElMessage.error('新密码和确认密码不一致');
        return;
    }
    updateUserPassword(passwordData.oldPassword,passwordData.newPassword,passwordData.confirmPassword).then(() => {
        ElMessage.success('密码修改成功');
        passwordData.oldPassword = '';
        passwordData.newPassword = '';
        passwordData.confirmPassword = '';
    })
}

const passwordRules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
    confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
        if (value !== passwordData.newPassword) {
            callback(new Error('两次输入的密码不一致'));
        } else {
            callback();
        }
        }, trigger: 'blur' }
    ]
};

</script>

<style scoped>

</style>