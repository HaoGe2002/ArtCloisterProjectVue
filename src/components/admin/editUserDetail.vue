<template>
  <div>
    <!-- 📌 头像区域 -->
    <div>
      <span style="font-size: 15px;">头像</span>
      <div class="avatar-container">
        <el-avatar shape="square" :size="100" :src="getImageUrl(userForm.avatar)" />
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="openUploadDialog">
          更换头像
        </el-button>
      </div>
    </div>

    <!-- 📌 头像上传弹窗 -->
    <el-dialog v-model="uploadDialogVisible" title="上传头像" width="400px">
      <UploadImage :limit="1" v-model="userForm.avatar" @update:modelValue="updateAvatar" />
      <template #footer>
        <el-button @click="uploadAvatar" type="primary">保存</el-button>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
      </template>
    </el-dialog>

    <el-form ref="formRef" :model="userForm" :rules="rules" label-width="100px">
      <!-- 📌 用户名 -->
      <el-form-item label="用户名" prop="username">
        <el-input v-model="userForm.username" :disabled="isEditMode" />
      </el-form-item>

      <!-- 📌 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="userForm.nickname" />
      </el-form-item>

      <!-- 📌 密码 -->
      <el-form-item v-if="!userId" label="密码" prop="password">
        <el-input v-model="userForm.password" type="password" placeholder="编辑用户时可留空" />
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="userForm.phone" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 📌 角色 -->
      <el-form-item label="角色" prop="roleId">
        <el-select v-model="userForm.roleId" placeholder="">
          <el-option label="管理员" :value="1" />
          <el-option label="普通用户" :value="2" />
        </el-select>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-select v-model="userForm.status">
              <el-option label="启用" :value="0" />
              <el-option label="禁用" :value="1" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="userForm.gender">
              <el-option label="男" :value="0" />
              <el-option label="女" :value="1" />
              <el-option label="未知" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 📌 个人简介 -->
      <el-form-item label="个人简介">
        <el-input v-model="userForm.bio" type="textarea" :rows="3" />
      </el-form-item>

      <el-form-item>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitUser">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { getUser } from "@/api/user/user.js";
import { updateUserDetail, addUser } from "@/api/admin/user.js";
import { getImageUrl } from "@/utils/utils";
import UploadImage from '@/components/ImageUpload/index.vue';
// 🎯 控制头像上传弹窗
const uploadDialogVisible = ref(false);

// 🚀 头像上传对象
const userAvatar = reactive({
  avatar: "",
});

// 🔄 是否是编辑模式
const isEditMode = ref(false);

// 📡 组件通信
const emit = defineEmits(["refresh", "close"]); 
const props = defineProps({
  userId: Number
});

// 🎯 加载用户数据
onMounted(() => {
  if (props.userId) {
    console.log("编辑用户");
    loadUserInfo(props.userId);
  } else {
    console.log("新增用户");
  }
});

watch(() => props.userId, (newValue) => {
  if (newValue) {
    isEditMode.value = true;
    loadUserInfo(newValue);
  } else {
    isEditMode.value = false;
    resetForm();
  }
});

// 🚀 加载用户信息
const loadUserInfo = (userId) => {
  getUser(userId).then(res => {
    const data = res.data;
    userForm.avatar = data.avatar;
    userForm.userId = data.userId;
    userForm.username = data.username;
    userForm.nickname = data.nickname;
    userForm.email = data.email;
    userForm.phone = data.phone;
    userForm.roleId = data.roleId;
    userForm.status = data.status;
    userForm.gender = data.gender;
    userForm.bio = data.bio;
  });
};

// 🛠 表单验证规则
const rules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: false, message: "请输入密码", trigger: "blur" }],
};

// 🎯 打开上传头像弹窗
const openUploadDialog = () => {
  uploadDialogVisible.value = true;
};

// 🎯 更新头像（监听 UploadImage 组件的值变化）
const updateAvatar = (avatarUrl) => {
  userAvatar.avatar = avatarUrl;
};

// 🎯 头像上传完成后更新用户信息
const uploadAvatar = () => {
  if (!userAvatar.avatar) {
    ElMessage.error("请先上传图片");
    return;
  }
  userForm.avatar = userAvatar.avatar;
  uploadDialogVisible.value = false;
  ElMessage.success("头像更新成功");
};

// 🛠 用户表单
const userForm = reactive({
  userId: null,
  avatar: "",
  username: "",
  nickname: "",
  password: "",
  email: "",
  phone: "",
  roleId: 2,
  status: 0,
  gender: 2,
  bio: ""
});

// 🛠 重置表单（用于新增用户）
const resetForm = () => {
  Object.assign(userForm, {
    userId: null,
    username: "",
    nickname: "",
    password: "",
    email: "",
    phone: "",
    roleId: 2,
    status: 0,
    gender: 2,
    bio: ""
  });
};

// 🎯 关闭弹窗
const closeDialog = () => {
  resetForm();
  emit("close");
};

// 🚀 提交用户信息
const submitUser = async () => {
  if (isEditMode.value) {
    updateUserDetail(userForm)
      .then(() => {
        closeDialog();
        ElMessage.success("用户信息更新成功");
        emit("refresh");
      })
      .catch(err => console.log(err));
  } else {
    addUser(userForm)
      .then(() => {
        closeDialog();
        ElMessage.success("用户添加成功");
        emit("refresh");
      })
      .catch(err => console.log(err));
  }
};
</script>
