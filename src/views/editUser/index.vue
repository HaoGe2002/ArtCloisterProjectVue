<template>
    <HeaderBar />
    
    <div class="profile-container">
      <h2>基本设置</h2>
      <uploadAvatar :avatar="avatar" @updateAvatar="loadUserInfo"/>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        label-position="top"
        class="profile-form"
        style="margin-top: 10px;"
      >
      
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" :disabled="!isEditing"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
                <el-select v-model="formData.gender" placeholder="请选择性别" :disabled="!isEditing">
                    <el-option label="男" :value="0"></el-option>
                    <el-option label="女" :value="1"></el-option>
                    <el-option label="其他" :value="2"></el-option>
                </el-select>
            </el-form-item>

          </el-col>
        </el-row>
  
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" :disabled="!isEditing"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="formData.phone" :disabled="!isEditing"/>
            </el-form-item>
          </el-col>
        </el-row>
  
        <el-form-item label="个人简介">
          <el-input v-model="formData.bio" type="textarea" :rows="3" :disabled="!isEditing"/>
        </el-form-item>
  
        <el-form-item>
          <el-button v-if="!isEditing" type="primary" @click="enableEdit">编辑</el-button>
          <div v-else>
            <el-button type="success" @click="submitForm">保存</el-button>
            <el-button  @click="cancelEdit">取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <shippingAddresses/>
    <UpdataPassword />
    
</template>
<script setup>
import HeaderBar from '@/components/Pages/mune/header.vue';
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import {useUserStore} from '@/store/modules/userStore'
import {updateUser} from '@/api/user/user'

import UpdataPassword from "../../components/User/updataPassword.vue";
const userStore = useUserStore()

// 个人信息表单
const formRef = ref(null);
const isEditing = ref(false);
const avatar = ref('')
const formData = reactive({
    nickname: "",
    gender: "",
    email: "",
    phone: "",
    bio: "",
});

onMounted(async () => {
  await loadUserInfo();
});
const loadUserInfo = async () => {
    // ✅ 获取当前登录用户的信息
    userStore.getInfo().then(res => {
        avatar.value = res.avatar;

        formData.nickname = res.nickname;
        formData.email = res.email;
        formData.phone = res.phone;
        formData.gender = res.gender;
        formData.bio = res.bio;
    }).catch(err => {
        console.error(err)
    });
}

  // 表单验证规则
  const rules = {
    nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    gender: [{ required: true, message: "请选择性别", trigger: "change" }],
  };
  
  // 启用编辑模式
  const enableEdit = () => { isEditing.value = true; };
  
  // 取消编辑
  const cancelEdit = () => { 
    isEditing.value = false; 
    loadUserInfo()
};
  
  // 提交表单
  const submitForm = () => {
    formRef.value.validate(valid => {
      if (!valid) {
        ElMessage.error("请完善表单信息后再提交");
        return;
      }
      updateUser(formData).then(() => {
        ElMessage.success("个人信息更新成功");
        isEditing.value = false;
      });
    });
  };
  
  </script>
  
  <style scoped lang="scss">
  .profile-container {
    max-width: 900px;
    width: 80%;
    margin: 20px auto;
    padding: 20px;
    background: var(--art-light);
    border: var(--art-border-color) 1px solid;
    box-shadow: var(--art-box-shadow-xs);
    color: white;
    border-radius: 8px;
  }
  </style>
  