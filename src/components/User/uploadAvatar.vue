<template>
        <!-- <ImagePreview/> -->
    <div style="margin-top: 20px;">
    <span style="font-size: 15px;">头像</span>
    <div class="avatar-container">
        <el-avatar shape="square" :size="100" :src="getImageUrl(avatar)" />
        <el-button style="margin-left: 10px;" size="small" type="primary" @click="openUploadDialog">
        更换头像
        </el-button>
    </div>
    </div>
    <!-- 头像上传弹窗 -->
    <el-dialog v-model="uploadDialogVisible" title="上传头像" width="400px">
    <UploadImage
    :limit="1"
    v-model="userAvatar.avatar"
    />
    <template #footer>
        <el-button @click="uploadAvatar" type="primary">保存</el-button>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
    </template>
    </el-dialog>
</template>

<script setup>
import UploadImage from '@/components/ImageUpload/index.vue';
import { ElMessage } from "element-plus";
import { reactive } from 'vue';
import {updateUser} from '@/api/user/user'
import {updateUserDetail} from '@/api/admin/user'
import { getImageUrl } from '@/utils/utils';
const props = defineProps({
  avatar: String, // 从父组件接收头像 URL
  UserId: { type: Number }, // 是否为其他用户
});
const emit = defineEmits(["updateAvatar"]);
const uploadDialogVisible = ref(false);

const userAvatar = reactive({
    avatar: '',
})

// 打开上传弹窗
const openUploadDialog = () => {
  uploadDialogVisible.value = true;
};

//更新用户的头像
const uploadAvatar = () =>{
  if(!props.UserId){
    updateUser(userAvatar).then(() => {
      ElMessage.success("头像更新成功");
      emit("updateAvatar");
      uploadDialogVisible.value = false;
    })
  }else{
    const params = {
      avatar: userAvatar.avatar,
      userId: props.UserId
    }
    updateUserDetail(params).then (res => {
      emit("updateAvatar");
      uploadDialogVisible.value = false;
    })
  }

}

</script>

<style scoped lang="scss">
  .avatar-container{
    display: flex;
    align-items: end;
    margin-top: 8px;
  }
</style>