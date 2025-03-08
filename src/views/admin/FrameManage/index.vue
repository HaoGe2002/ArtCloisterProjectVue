<template>
    <div class="frame-management">
      <el-card>
        <!-- 🔍 搜索框 -->
        <div class="header">
          <el-input v-model="searchData.frameTypeName" placeholder="搜索画框名称" clearable style="width: 200px;" />
          
          <!-- 画框状态筛选 -->
          <el-select v-model="searchData.status" placeholder="画框状态" clearable style="width: 150px;">
            <el-option label="全部" value="" />
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="2" />
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
          
          <el-button type="primary" @click="fetchFrames" style="margin-left: 10px;">搜索</el-button>
        </div>
  
        <!-- 📌 操作按钮 -->
        <div style="margin: 10px 0;">
          <el-button type="primary" @click="openAddDialog">新增画框</el-button>
          <el-button type="warning" @click="openEditDialog" :disabled="selectedFrames.length !== 1">修改</el-button>
          <el-button type="danger" @click="deleteSelectedFrames" :disabled="selectedFrames.length === 0">删除</el-button>
        </div>
  
        <!-- 📜 画框列表 -->
        <el-table :data="frames" border style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          
          <el-table-column prop="imageUrl" label="封面图" align="center">
            <template #default="{ row }">
              <el-image :src="getImageUrl(row.imageUrl)" style="width: 75px; height: 75px;" fit="cover" />
            </template>
          </el-table-column>
  
          <el-table-column prop="frameTypeName" label="画框名称" align="center" />
          <el-table-column prop="description" label="画框介绍" align="center" />
          <el-table-column prop="price" label="价格 (¥)" align="center" />
          
          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 1 ? "上架" : "下架" }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 🔢 分页 -->
        <span class="total-count">共 {{ totalFrames }} 条数据</span>
        <el-pagination
          v-model:current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          :total="totalFrames"
          layout="prev, pager, next"
          style="margin-top: 10px;"
        />
  
        <!-- 🎨 新增/修改画框弹窗 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
          <el-form :model="formData" label-width="80px">
            <el-form-item label="画框名称">
              <el-input v-model="formData.frameTypeName" />
            </el-form-item>
            <el-form-item label="画框介绍">
              <el-input v-model="formData.description" type="textarea" />
            </el-form-item>
            <el-form-item label="价格 (¥)">
              <el-input v-model="formData.price" type="number" />
            </el-form-item>
            <el-form-item label="画框状态">
              <el-select v-model="formData.status">
                <el-option label="上架" :value="1" />
                <el-option label="下架" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="画框图片">
                <UploadImage :limit="1" v-model="formData.imageUrl" />
                <el-icon><Plus /></el-icon>
            </el-form-item>
          </el-form>
  
          <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveFrame">保存</el-button>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage } from "element-plus";
  import { selectAllFrames, addFrame, updateFrame, deleteFrames } from "@/api/frame/frame";
  import UploadImage from '@/components/ImageUpload/index.vue';
  import { parseTime,getImageUrl } from '@/utils/utils';
  
  // 📜 画框列表
  const frames = ref([]);
  const selectedFrames = ref([]);
  const dialogVisible = ref(false);
  const dialogTitle = ref("新增画框");
  
  // 🔍 搜索条件
  const searchData = reactive({
    frameTypeName: "",
    status: "",
    params:{
        beginTime: "",
        endTime: ""
    }
  });
  
  // 📆 日期范围
  const dateRange = ref([]);
  const handleDateChange = (val) => {
    if (val && val.length === 2) {
      searchData.params.beginTime = val[0];
      searchData.params.endTime = val[1];
    } else {
      searchData.params.beginTime = "";
      searchData.params.endTime = "";
    }
  };

  // 📑 分页
  const pageParams = reactive({
    pageNum: 1,
    pageSize: 4
  });

  watch(() => pageParams.pageNum, () => {
    fetchFrames();
  });
  const totalFrames = ref();
  
  // 📡 获取画框数据
  const fetchFrames = async () => {
    try {
      const res = await selectAllFrames(pageParams,searchData);
      totalFrames.value = res.total;
      frames.value = res.rows;
    } catch (error) {
      console.error("获取画框列表失败", error);
    }
  };
  

  const formData = ref({
    frameUrl: '',
    artworkUrl: '',
    price: '',
    description: '',
    isPublic: false,
  })
  // 📌 选择画框
  const handleSelectionChange = (val) => {
    selectedFrames.value = val;
  };
  
  // 🆕 打开新增弹窗
  const openAddDialog = () => {
    dialogTitle.value = "新增画框";
    formData.value = { 
        name: "", description: "", price: "", status: 1, frameImage: "" };
    dialogVisible.value = true;
  };
  
  // ✏️ 打开修改弹窗
  const openEditDialog = () => {
    if (selectedFrames.value.length === 1) {
      dialogTitle.value = "修改画框";
      formData.value = { ...selectedFrames.value[0] };
      dialogVisible.value = true;
    }
  };
  
  // 💾 保存画框（新增/修改）
  const saveFrame = async () => {
    try {
      if (dialogTitle.value === "新增画框") {
        await addFrame(formData.value);
      } else {
        await updateFrame(formData.value);
      }
      dialogVisible.value = false;
      fetchFrames();
      ElMessage.success("操作成功！");
    } catch (error) {
      ElMessage.error("操作失败！");
    }
  };
  
  // 🗑️ 删除画框
  const deleteSelectedFrames = async () => {
    try {
      await deleteFrames(selectedFrames.value.map(f => f.frameTypeId));
      fetchFrames();
      ElMessage.success("删除成功！");
    } catch (error) {
      ElMessage.error("删除失败！" + error);
    }
  };
  
  // 📤 上传图片成功
  const handleUploadSuccess = (response) => {
    formData.value.frameImage = response.url;
  };
  
  // 🔄 组件加载时获取数据
  onMounted(() => {
    fetchFrames();
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
  