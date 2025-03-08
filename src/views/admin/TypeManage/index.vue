<template>
    <div class="type-management">
      <el-card>
        <!-- 🔍 搜索框 -->
        <div class="header">
          <el-input v-model="searchData.subcategoryName" placeholder="搜索类型名称" clearable style="width: 200px;" />
  
          <el-select v-model="searchData.status" placeholder="类型状态" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="启用" :value="0" />
            <el-option label="禁用" :value="1" />
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

          <el-button type="primary" @click="fetchTypes" style="margin-left: 10px;">搜索</el-button>
        </div>
  
        <!-- 📌 操作按钮 -->
        <div style="margin: 10px 0;">
          <el-button type="primary" @click="openAddDialog">新增类型</el-button>
          <el-button type="warning" @click="openEditDialog" :disabled="selectedTypes.length !== 1">修改</el-button>
          <el-button type="danger" @click="deleteSelectedTypes" :disabled="selectedTypes.length === 0">删除</el-button>
        </div>
  
        <!-- 📜 类型列表 -->
        <el-table :data="types" border style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column prop="imageUrl" label="图标" align="center">
            <template #default="{ row }">
              <el-image :src="getImageUrl(row.imageUrl)" style="width: 75px; height: 75px;" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column prop="subcategoryId" label="ID" align="center" />
          <el-table-column prop="subcategoryName" label="类型名称" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="viewArtworkDetail(row)">
                {{ row.subcategoryName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="类型描述" align="center" />
          <el-table-column prop="onArtworkNumber" label="该类型的艺术品数量" align="center" />
          <el-table-column prop="is3d" label="是否为3D" align="center">
            <template #default="{ row }">

            {{ row.is3d === 1 ? "是" : "否" }}
        </template>
          </el-table-column>

        <el-table-column  prop="createdAt" label="创建时间" width="120" align="center">
        </el-table-column>

        <el-table-column  prop="updatedAt" label="更新时间" width="120" align="center">
        </el-table-column>

        <el-table-column label="状态" align="center">
        <template #default="{ row }">
            <el-tag :type="row.status === 0 ? 'success' : 'danger'">
            {{ row.status === 0 ? "启用" : "禁用" }}
            </el-tag>
        </template>
        </el-table-column>
        </el-table>
  
        <!-- 🔢 分页 -->
        <span class="total-count">共 {{ total }} 条数据</span>
        <el-pagination
          v-model:current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          :total="total"
          layout="prev, pager, next"
          style="margin-top: 10px;"
        />
  
        <!-- 🎨 新增/修改类型弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
          <el-form :model="formData" label-width="80px">
            <el-form-item label="类型名称">
              <el-input v-model="formData.subcategoryName" />
            </el-form-item>
            <el-form-item label="类型描述">
              <el-input v-model="formData.remark" type="textarea" />
            </el-form-item>
            <el-form-item label="类型状态">
              <el-select v-model="formData.status">
                <el-option label="启用" :value="0" />
                <el-option label="禁用" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否为3D">
              <el-select v-model="formData.is3d">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item label="类型图标">
                <UploadImage :limit="1" v-model="formData.imageUrl" />
            </el-form-item>
          </el-form>
  
          <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveType">保存</el-button>
          </template>
        </el-dialog>

        <el-drawer v-model="drawerVisible" title="类型详情" size="50%">
            <el-descriptions :column="1" border>
                <el-descriptions-item label="创建时间"> {{typeDetail.createdAt }}</el-descriptions-item>
                <el-descriptions-item label="更新时间">{{typeDetail.updatedAt}}</el-descriptions-item>
                <el-descriptions-item label="类型名称">{{typeDetail.subcategoryName}}</el-descriptions-item>
                <el-descriptions-item label="类型描述">{{typeDetail.remark}}</el-descriptions-item>
                <el-descriptions-item label="是否为3D">{{typeDetail.is3d === 1 ? "是" : "否"}}</el-descriptions-item>
                <el-descriptions-item label="状态">{{typeDetail.status === 0 ? "启用" : "禁用"}}</el-descriptions-item>
                <el-descriptions-item label="该类型的艺术品数量">{{typeDetail.onArtworkNumber}}</el-descriptions-item>
                <el-descriptions-item label="图标">
                    <el-image :src="getImageUrl(typeDetail.imageUrl)" style="width: 75px; height: 75px;" fit="cover" />
                </el-descriptions-item>
                <el-descriptions-item label="创建人ID">{{typeDetail.createdBy}}</el-descriptions-item>
                <el-descriptions-item label="更新人ID">{{typeDetail.updatedBy}}</el-descriptions-item>

            </el-descriptions>
        </el-drawer>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  import {getSubCategoriesList,addSubcategory,updateSubcategory,deleteSubcategories} from "@/api/type/type";
  import { parseTime,getImageUrl } from '@/utils/utils';
  import UploadImage from '@/components/ImageUpload/index.vue';
//   import { selectAllTypes, addType, updateType, deleteTypes } from "@/api/type/type";
  
  // 📜 类型列表
  const types = ref([]);
  const selectedTypes = ref([]);
  const dialogVisible = ref(false);
  const dialogTitle = ref("新增类型");
  // 日期范围（用于绑定 `el-date-picker`）
  const drawerVisible = ref(false);
const dateRange = ref([]);
const formData = ref({})
  // 处理日期选择
const handleDateChange = (val) => {
  if (val && val.length === 2) {
    searchData.params.beginTime = val[0]; // 赋值开始时间
    searchData.params.endTime = val[1];   // 赋值结束时间
  } else {
    searchData.params.beginTime = "";
    searchData.params.endTime = "";
  }
};

const typeDetail = ref({})
const viewArtworkDetail = (row) => {
    typeDetail.value = row;
    drawerVisible.value = true;
}
  // 🔍 搜索条件
  const searchData = reactive({
    subcategoryName: "",
    status: "",
    params: {
        beginTime: "",
        endTime: ""
    }
  });
  
  // 📑 分页
  const pageParams = reactive({
    pageNum: 1,
    pageSize: 5
  });

  watch(() => pageParams.pageNum, () => {
    fetchTypes();
  });
  const total = ref(0);
  
  // 📡 获取类型数据
  const fetchTypes = async () => {
    try {
      const res = await getSubCategoriesList(pageParams, searchData);
      total.value = res.total;
      types.value = res.rows;
      console.log(res);
    } catch (error) {
      console.error("获取类型列表失败", error);
    }
  };
  
  // 📌 选择类型
  const handleSelectionChange = (val) => {
    selectedTypes.value = val;
  };
  
  // 🆕 打开新增弹窗
  const openAddDialog = () => {
    dialogTitle.value = "新增类型";
    formData.value = { 
      typeName: "",
       description: "",
       is3d: 1,
      status: 1 };
    dialogVisible.value = true;
  };
  
  // ✏️ 打开修改弹窗
  const openEditDialog = () => {
    if (selectedTypes.value.length === 1) {
      dialogTitle.value = "修改类型";
      formData.value = { ...selectedTypes.value[0] };
      dialogVisible.value = true;
    }
  };
  
  // 💾 保存类型（新增/修改）
  const saveType = async () => {

    if (dialogTitle.value === "新增类型") {
    await addSubcategory(formData.value);
    } else {
    await updateSubcategory(formData.value);
    }
    dialogVisible.value = false;
    fetchTypes();
    ElMessage.success("操作成功！");

  };
  
  // 🗑️ 删除类型
  const deleteSelectedTypes = async () => {
    await deleteSubcategories(selectedTypes.value.map(t => t.subcategoryId));
    fetchTypes();
    ElMessage.success("删除成功！");
  };
  
  // 🔄 组件加载时获取数据
  onMounted(() => {
    fetchTypes();
  });
  </script>
  
  <style scoped>
  .total-count {
    margin-right: 15px;
    font-size: 14px;
    color: #666;
  }
  .header {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  </style>
  