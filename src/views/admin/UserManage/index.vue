<template>
  <div class="user-manage">
    <el-card>
      <!-- 搜索框 -->
      <div class="header">
        <el-input v-model="data.username" placeholder="搜索用户名" clearable style="width: 200px;" />
        <el-input v-model="data.nickname" placeholder="搜索昵称" clearable style="width: 200px;" />
        <el-input v-model="data.phone" placeholder="搜索手机号" clearable style="width: 200px;" />
        <el-select v-model="data.status" placeholder="用户状态" clearable style="width: 150px;">
          <el-option label="所有" value="" />
          <el-option label="启用" :value=0 />
          <el-option label="禁用" :value=1 />
        </el-select>

        <el-select v-model="data.roleId" placeholder="用户角色" clearable style="width: 150px;">
          <el-option label="所有" value="" />
          <el-option label="管理员" value="1" />
          <el-option label="用户" value="2" />
        </el-select>

        <!-- 时间范围筛选 -->
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="创建日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          style="width: 300px;"
          @change="handleDateChange"
        />
        <el-button type="primary" @click="fetchUsers" style="margin-left: 10px;">搜索</el-button>
      </div>
      <!-- 批量操作 -->
      <div style="margin: 10px 0;">
        <el-button type="danger" @click="deleteSelectedUsers" :disabled="selectedUsers.length === 0"> 删除</el-button>
        <el-button type="primary" @click="editUser" :disabled="selectedUsers.length !== 1"> 编辑</el-button>
        <el-button type="primary" @click="insertUser"> 添加</el-button>
      </div>



      <!-- 用户表格 -->
      <el-table :data="users" border style="width: 100%;" @selection-change="handleSelectionChange">
        <!-- 勾选框 -->
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column prop="avatar" label="头像" width="65" align="center">
          <template #default="{ row }">
            <el-avatar :src="getImageUrl(row.avatar)" />
          </template>
        </el-table-column>

        <el-table-column  prop="userId" label="ID" width="60" align="center" />

        <el-table-column  prop="username" width="150" label="用户名" align="center">
          <template #default="{ row }">
            <el-button type="text"  @click="handleUsernameClick(row)">
              {{ row.username }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column  prop="nickname" width="150" label="昵称" align="center" />
        <el-table-column  prop="email" width="150" label="邮箱" align="center" />
        <el-table-column  prop="phone" width="120" label="电话" align="center" />
        <el-table-column  prop="balance" width="60" label="余额" align="center" />
        
        <el-table-column  label="状态" width="78" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
              {{ row.status === 0 ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column  prop="gender" width="60" label="性别" align="center" >
          <template #default="{ row }">
            {{ row.gender === 1 ? "男" : row.gender === 2 ? "女" : "其他" }}
          </template>
        </el-table-column>

        <el-table-column  prop="roleId" width="110" label="角色" align="center" >
          <template #default="{ row }">
            <el-tag :type="row.roleId === 1 ? 'success' : 'primary'">
              {{ row.roleId === 1 ? "管理员" : row.roleId === 2 ? "普通用户" : "其他" }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column  prop="createdAt" label="创建时间" width="120" align="center">
        </el-table-column>

        <el-table-column  prop="updatedAt" label="更新时间" width="120" align="center">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <span class="total-count">共 {{ totalUsers }} 条数据</span>
      <el-pagination
        v-model:current-page="pageParams.pageNum"
        :page-size="pageParams.pageSize"
        :total="totalUsers"
        layout=" prev, pager, next"
        style="margin-top: 10px;"
      />

      <!-- 编辑/添加用户弹窗 -->
      <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="formData.nickname" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="formData.gender" placeholder="请选择性别">
            <el-option label="男" :value="1" />
            <el-option label="女" :value="2" />
            <el-option label="其他" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <!-- 🔒 密码输入框（新增必填，编辑时隐藏） -->
        <el-form-item label="密码" v-if="isEditing ? showPasswordInput : true">
          <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>

        <!-- 📌 编辑模式下显示“修改密码”按钮 -->
        <el-form-item v-if="isEditing && !showPasswordInput">
          <el-button type="warning" @click="showPasswordInput = true">修改密码</el-button>
        </el-form-item>

        <el-form-item label="账户状态">
          <el-select v-model="formData.status">
            <el-option label="正常" :value="0" />
            <el-option label="禁用" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="账户角色">
          <el-select v-model="formData.roleId">
            <el-option label="普通用户" :value="2" />
            <el-option label="管理员" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="余额">
          <el-input v-model="formData.balance"/>
        </el-form-item>
        <el-form-item label="用户头像">
          <UploadImage :limit="1" v-model="formData.avatar" />
        </el-form-item>
      </el-form>

      <!-- 📌 弹窗底部按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>

      <el-drawer v-model="drawerVisible" title="用户详情" size="50%">
    <el-descriptions :column="2" border>
      <!-- 🎭 用户基本信息 -->
      <el-descriptions-item label="用户名">{{ userDetail.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ userDetail.nickname }}</el-descriptions-item>
      <el-descriptions-item label="性别">
        <el-tag :type="getGenderTag(userDetail.gender)">
          {{ getGenderText(userDetail.gender) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ userDetail.email || "未填写" }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ userDetail.phone || "未填写" }}</el-descriptions-item>

      <!-- 📅 账户信息 -->
      <el-descriptions-item label="用户 ID">{{ userDetail.userId }}</el-descriptions-item>
      <el-descriptions-item label="角色 ID">{{ userDetail.roleId }}</el-descriptions-item>
      <el-descriptions-item label="账户状态">
        <el-tag :type="getStatusTag(userDetail.status)">
          {{ getStatusText(userDetail.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="余额">￥{{ userDetail.balance ?? "0.00" }}</el-descriptions-item>

      <!-- 📅 时间信息 -->
      <el-descriptions-item label="创建时间">{{ userDetail.createdAt }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ userDetail.updatedAt }}</el-descriptions-item>
      <el-descriptions-item label="最后登录时间">{{ userDetail.lastLoginAt || "未登录" }}</el-descriptions-item>
      <el-descriptions-item label="登录 IP">{{ userDetail.loginIp || "无" }}</el-descriptions-item>
    </el-descriptions>

    <!-- 🖼️ 头像展示 -->
    <div style="margin-top: 20px; text-align: center">
      <h3>用户头像</h3>
      <el-image v-if="userDetail.avatar" :src="getImageUrl(userDetail.avatar)" fit="cover" style="width: 120px; height: 120px; border-radius: 50%;" />
      <p v-else>暂无头像</p>
    </div>
      </el-drawer>

    </el-card>
  </div>
</template>

<script setup>
import { selectUserList,removerUser } from "@/api/user/user";
import { getImageUrl } from "@/utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import {getUser} from "@/api/user/user"
import UploadImage from '@/components/ImageUpload/index.vue';
import { status } from "nprogress";
// 用户列表
const users = ref([]);
const selectedUsers = ref([]); // 选中的用户列表
const dialogVisible = ref(false);
const dialogTitle = ref("");
const selectedUserId = ref(null);
const drawerVisible = ref(false);
const userDetail = ref({});

const isEditing = ref(false); // 是否是编辑模式
const showPasswordInput = ref(false); // 是否显示密码输入框
const handleUsernameClick = (row) => {
  getUser(row.userId).then((res) => {
    userDetail.value = res.data;
    drawerVisible.value = true;
  })
  
};

// 🎨 状态文本转换
const getStatusText = (status) => {
  switch (status) {
    case 0: return "正常";
    case 1: return "禁用";
    default: return "未知";
  }
};
// 🎨 性别颜色
const getGenderTag = (gender) => {
  switch (gender) {
    case 1: return "blue";
    case 2: return "pink";
    default: return "";
  }
};
// 🎨 状态颜色
const getStatusTag = (status) => {
  switch (status) {
    case 0: return "success";
    case 1: return "danger";
    default: return "";
  }
};
// 🎨 性别文本转换
const getGenderText = (gender) => {
  switch (gender) {
    case 1: return "男";
    case 2: return "女";
    default: return "未知";
  }
};

// 搜索条件
const data = reactive({
  username: "",
  phone: "",
  params: {
    beginTime : "",
    endTime : ""
  }
});

// 日期范围（用于绑定 `el-date-picker`）
const dateRange = ref([]);

// 处理日期选择
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    data.params.beginTime = val[0]; // 赋值开始时间
    data.params.endTime = val[1];   // 赋值结束时间
  } else {
    data.params.beginTime = "";
    data.params.endTime = "";
  }
};

// 分页
const pageParams = reactive({
  pageNum: 1,
  pageSize: 7
});

watch(() => pageParams.pageNum, () => {
  fetchUsers();
});

// 计算总用户数
const totalUsers = ref();
// 获取用户列表
const fetchUsers = async () => {
  try {
    const res = await selectUserList(data, pageParams);
    totalUsers.value = res.total;
    users.value = res.rows;
    console.log(res);
  } catch (error) {
    console.error("获取用户列表失败", error);
  }
};

// 监听表格勾选变化
const handleSelectionChange = (selectedRows) => {
  selectedUsers.value = selectedRows;
};

// 批量删除用户
const deleteSelectedUsers = () => {
  if (selectedUsers.value.length === 0) {
    ElMessage.warning("请先选择用户");
    return;
  }
  ElMessageBox.confirm("确定要删除选中的用户吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    removerUser(selectedUsers.value.map(user => user.userId)).then (() => {
      ElMessage.success("删除成功");
      fetchUsers();
    }).catch (() => {
      ElMessage.error("删除失败");
    });
  }).catch(() => {
    ElMessage.error("删除失败");
  });
};

import {addUser,updateUserDetail} from "@/api/admin/user";

const formData = reactive({})
const saveUser = async () => {
    if (!formData.username) {
      ElMessage.warning("用户名不能为空");
      return;
    }
    if (formData.userId) {
      await updateUserDetail(formData);
    } else {
      if (!formData.password) {
        ElMessage.warning("密码不能为空");
        return;
      }
      await addUser(formData);
    }
    dialogVisible.value = false;
    ElMessage.success("操作成功");
    fetchUsers();
};

// 编辑用户
const editUser = () => {
  isEditing.value = true;
  showPasswordInput.value = false; // 默认不显示密码输入框
  dialogTitle.value = "编辑用户";
  selectedUserId.value = selectedUsers.value[0].userId

  const user = selectedUsers.value[0]; // 获取选中的用户
  formData.userId = user.userId;
  formData.username = user.username;
  formData.nickname = user.nickname;
  formData.gender = user.gender;
  formData.phone = user.phone;
  formData.email = user.email;
  formData.status = user.status;
  formData.avatar = user.avatar;
  formData.balance = user.balance;
  formData.roleId = user.roleId;

  formData.password = ""; // ✅ 这里不填充密码，用户可选填

  dialogVisible.value = true;
};
const insertUser = () => {
  
  isEditing.value = false;
  showPasswordInput.value = true; // ✅ 新增用户时必须显示密码输入框
  Object.assign(formData, {
    userId: null,
    username: "",
    nickname: "",
    gender: 1,
    phone: "",
    email: "",
    password: "", // ✅ 新增用户必须输入密码
    status: 0,
    roleId: 2,
    balance:0,
    avatar: "",
  });
  console.log(formData);
  dialogTitle.value = "添加用户";
  dialogVisible.value = true;
}

// 组件挂载时获取数据
onMounted(fetchUsers);
</script>

<style scoped>
.total-count {
  margin-right: 15px;
  font-size: 14px;
  color: #666;
}
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
}
.header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}
</style>
