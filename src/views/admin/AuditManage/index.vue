<template>
    <div class="artwork-review">
      <el-card>
        <!-- 搜索框 -->
        <div class="header">
          <el-input v-model="searchData.name" placeholder="搜索艺术品名称" clearable style="width: 200px;" />
          <el-input v-model="searchData.artist" placeholder="搜索艺术家" clearable style="width: 200px;" />
          
          <el-select v-model="searchData.status" placeholder="审核状态" clearable style="width: 150px;">
            <el-option label="所有" value="" />
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="未通过" :value="2" />
          </el-select>
  
          <el-button type="primary" @click="fetchArtworks" style="margin-left: 10px;">搜索</el-button>
        </div>
  
        <!-- 艺术品列表 -->
        <el-table :data="artworks" border style="width: 100%;">
          <el-table-column prop="artworkId" label="ID" width="60" align="center" />
          
          <el-table-column prop="name" label="名称" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="viewArtworkDetail(row)">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
  
          <el-table-column prop="artist" label="艺术家" align="center" />
          <el-table-column prop="category" label="类别" align="center" />
          <el-table-column prop="price" label="价格" align="center" />
          
          <el-table-column label="审核状态" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'">
                {{ row.status === 0 ? "待审核" : row.status === 1 ? "已通过" : "未通过" }}
              </el-tag>
            </template>
          </el-table-column>
  
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button type="success" size="small" @click="approveArtwork(row.artworkId)" :disabled="row.status === 1">
                通过
              </el-button>
              <el-button type="danger" size="small" @click="rejectArtwork(row.artworkId)" :disabled="row.status === 2">
                未通过
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页 -->
        <el-pagination
          v-model:current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          :total="totalArtworks"
          layout="prev, pager, next"
          style="margin-top: 10px;"
        />
  
        <!-- 艺术品详情弹窗 -->
        <el-dialog v-model="dialogVisible" title="艺术品详情" width="800px">
          <ArtworkDetail :artwork="selectedArtwork" />
        </el-dialog>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
//   import { fetchArtworkList, approveArtworkById, rejectArtworkById } from "@/api/artwork";
//   import ArtworkDetail from "@/components/Artwork/ArtworkDetail.vue";
  
  // 艺术品列表
  const artworks = ref([]);
  const selectedArtwork = ref(null);
  const dialogVisible = ref(false);
  
  // 搜索条件
  const searchData = reactive({
    name: "",
    artist: "",
    status: ""
  });
  
  // 分页
  const pageParams = reactive({
    pageNum: 1,
    pageSize: 7
  });
  
  const totalArtworks = ref(0);
  
  // 获取艺术品数据
  const fetchArtworks = async () => {
    try {
      const res = await fetchArtworkList(searchData, pageParams);
      totalArtworks.value = res.total;
      artworks.value = res.rows;
    } catch (error) {
      console.error("获取艺术品列表失败", error);
    }
  };
  
  // 查看艺术品详情
  const viewArtworkDetail = (artwork) => {
    selectedArtwork.value = artwork;
    dialogVisible.value = true;
  };
  
  // 通过审核
  const approveArtwork = (artworkId) => {
    ElMessageBox.confirm("确定要通过该艺术品的审核吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      try {
        await approveArtworkById(artworkId);
        ElMessage.success("审核通过");
        fetchArtworks();
      } catch (error) {
        ElMessage.error("操作失败");
      }
    });
  };
  
  // 未通过审核
  const rejectArtwork = (artworkId) => {
    ElMessageBox.confirm("确定要拒绝该艺术品的审核吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      try {
        await rejectArtworkById(artworkId);
        ElMessage.success("已拒绝该艺术品");
        fetchArtworks();
      } catch (error) {
        ElMessage.error("操作失败");
      }
    });
  };
  
  // 组件挂载时获取数据
  onMounted(fetchArtworks);
  </script>
  
  <style scoped>
  .header {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  </style>
  