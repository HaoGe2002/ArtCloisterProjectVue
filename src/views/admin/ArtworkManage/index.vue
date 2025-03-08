<template>
    <div class="artwork-review">
      <el-card>
        <!-- 🔍 搜索框 -->
        <div class="header">
          <el-input v-model="searchData.name" placeholder="搜索艺术品名称" clearable style="width: 200px;" />
          <el-input v-model="searchData.params.nickname" placeholder="按作者昵称搜索" clearable style="width: 200px;" />
          <el-select v-model="searchData.subcategoryId" placeholder="艺术品类别" clearable style="width: 150px;">
          <!-- 全部选项 -->
            <el-option label="全部" value="" />

            <!-- 动态渲染类别 -->
            <el-option 
                v-for="category in categories" 
                :key="category.subcategoryId" 
                :label="category.subcategoryName" 
                :value="category.subcategoryId" 
            />
          </el-select>
            
          <el-select v-model="searchData.status" placeholder="艺术品状态" clearable style="width: 150px;">
            <el-option label="所有" value="" />
            <el-option label="未审核" :value="0" />
            <el-option label="审核中" :value="1" />
            <el-option label="审核通过" :value="2" />
            <el-option label="审核未通过" :value="3" />
            <el-option label="上架" :value="4" />
            <el-option label="售出" :value="5" />
            <el-option label="下架" :value="6" />
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
          
          <el-button type="primary" @click="fetchArtworks" style="margin-left: 10px;">搜索</el-button>
        </div>
  
        <!-- 📌 操作按钮 -->
        <div style="margin: 10px 0;">
          <el-button type="danger" @click="deleteSelectedArts" :disabled="selectedArtwork.length === 0"> 删除</el-button>
          <el-button type="primary" @click="updateSelectedArts" :disabled="selectedArtwork.length !== 1"> 编辑</el-button>
          <el-button type="primary" @click="addSelectedArts"> 添加</el-button>
        </div>
  
        <!-- 📜 艺术品列表 -->
        <el-table :data="artworks" border style="width: 100%;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          
          <el-table-column prop="coverImage" label="封面图" align="center">
            <template #default="{ row }">
              <el-image :src="getImageUrl(row.coverImage)" style="width: 75px; height: 75px;" fit="cover" />
            </template>
          </el-table-column>
  
          <el-table-column prop="name" label="名称" align="center">
            <template #default="{ row }">
              <el-button type="text" @click="viewArtworkDetail(row)">
                {{ row.name }}
              </el-button>
            </template>
          </el-table-column>
  
          <el-table-column prop="nickname" label="作者" align="center" />
          <el-table-column prop="artworkSubcategories.subcategoryName" label="类别" align="center" />
          <el-table-column prop="price" label="价格 (¥)" align="center" />
          

          <el-table-column  prop="favorites" label="收藏量" width="120" align="center">
          </el-table-column>

          <el-table-column  prop="browsing" label="浏览量" width="120" align="center">
          </el-table-column>

          <el-table-column  prop="createdAt" label="创建时间" width="120" align="center">
          </el-table-column>

          <el-table-column  prop="updatedAt" label="更新时间" width="120" align="center">
          </el-table-column>

          <el-table-column label="状态" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status.statusId)">
                {{ row.status.statusName}}
              </el-tag>
            </template>
          </el-table-column>

        </el-table>
  
        <!-- 🔢 分页 -->
        <span class="total-count">共 {{ totalArtworks }} 条数据</span>
        <el-pagination
          v-model:current-page="pageParams.pageNum"
          :page-size="pageParams.pageSize"
          :total="totalArtworks"
          layout="prev, pager, next"
          style="margin-top: 10px;"
        />
  
        <!-- 🎨 艺术品详情弹窗 -->
        <el-dialog v-model="dialogDetail" title="艺术品详情" width="800px">

        </el-dialog>
        <el-dialog v-model="dialogVisible" title="艺术品编辑" width="800px">
          <physical v-if="dialogVisible" @close="closeDialog" :adminArtworkId="selectedArtwork[0].artworkId"/>
        </el-dialog>

        <el-dialog v-model="dialogAdd" title="艺术品添加" width="800px">
          <physical v-if="dialogAdd"  @close="closeDialog" :addArtwork="true"/>
        </el-dialog>

      </el-card>

      <el-drawer v-model="drawerVisible" title="艺术品详情" size="50%">
        <el-descriptions :column="2" border>
          <!-- 🎨 艺术品基本信息 -->
          <el-descriptions-item label="名称">{{ ArtworkDetail.artwork.name }}</el-descriptions-item>
          <el-descriptions-item label="价格">￥{{ ArtworkDetail.artwork.price }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(ArtworkDetail.artwork.status)">
              {{ getStatusText(ArtworkDetail.artwork.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建者">{{ ArtworkDetail.artwork.createdBy }}</el-descriptions-item>

          <!-- 📅 时间信息 -->
          <el-descriptions-item label="创建时间">{{ ArtworkDetail.artwork.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ ArtworkDetail.artwork.updatedAt }}</el-descriptions-item>

          <!-- 📏 尺寸信息 -->
          <el-descriptions-item label="宽度">{{ ArtworkDetail.artwork.width }} cm</el-descriptions-item>
          <el-descriptions-item label="高度">{{ ArtworkDetail.artwork.height }} cm</el-descriptions-item>
          <el-descriptions-item label="长度">{{ ArtworkDetail.artwork.length }} cm</el-descriptions-item>

          <!-- 🏷️ 分类信息 -->
          <el-descriptions-item label="类别">
            {{ ArtworkDetail.artworkSubcategories.subcategoryName }}
          </el-descriptions-item>

          <!-- 🎭 其它信息 -->
          <el-descriptions-item label="浏览量">{{ ArtworkDetail.browsing }}</el-descriptions-item>
          <el-descriptions-item label="收藏量">{{ ArtworkDetail.favorites }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ ArtworkDetail.artwork.description }}</el-descriptions-item>
          <el-descriptions-item label="作者">{{ ArtworkDetail.user.username }}</el-descriptions-item>
          <el-descriptions-item label="标签">
            <span v-for="(tag, index) in ArtworkDetail.artworkTags" :key="tag.tagId">
              <el-tag type="primary" style="margin-right: 5px;">{{ tag.name }}</el-tag>
            </span>
           
          </el-descriptions-item>
 
        </el-descriptions>

        <!-- 🖼️ 图片展示 -->
        <div style="margin-top: 20px">
          <h3>艺术品图片</h3>
          <el-carousel height="200px">
            <el-carousel-item v-for="(image, index) in ArtworkDetail.imageUrls" :key="index">
              <el-image :src="getImageUrl(image)" fit="cover" style="width: 100%; height: 100%;" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-drawer>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from "vue";
  import {getArtworks,deleteArtworks} from "@/api/admin/artwork";
  import {getSubCategories} from "@/api/type/type";
  import { getArtworkDetail } from "@/api/artwork/artwork";
  import { parseTime,getImageUrl } from '@/utils/utils';
  import physical from '@/views/shelvesArt/physical/index.vue';
  import { ElMessage, ElMessageBox } from "element-plus";

  
  // 📜 艺术品列表
  const artworks = ref([]);
  const selectedArtwork = ref([]);
  const dialogVisible = ref(false);
  const dialogAdd = ref(false);
  const dialogDetail = ref(false);
  const drawerVisible = ref(false);
  const categories = ref([]);

  const getStatusTag = (status) => {
  switch (status) {
    case 0: return "warning";
    case 1: return "info";
    case 2: return "success";
    case 3: return "danger";
    case 4: return "primary";
    case 5: return "success";
    case 6: return "danger";
    default: return "";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 0: return "未审核";
    case 1: return "审核中";
    case 2: return "审核通过";
    case 3: return "审核未通过";
    case 4: return "上架";
    case 5: return "售出";
    case 6: return "下架";
    default: return "未知";
  }
};

  const props = defineProps({
    
  })

  const closeDialog = () =>{
    dialogVisible.value = false;
    dialogAdd.value = false;
    fetchArtworks()
  }

  const deleteSelectedArts = () => {
    deleteArtworks(selectedArtwork.value.map(artwork => artwork.artworkId)).then (() => {
      ElMessage.success("删除成功");
      fetchArtworks();
    })
  };

  const addSelectedArts =  () => {
    dialogAdd.value = true;
  };

  const updateSelectedArts = () =>{
    dialogVisible.value = true;
  }

  const handleSelectionChange = (selectedRows) => {
    selectedArtwork.value = selectedRows;
};

  const getStatusTagType = (status) => {
  switch (status) {
    case 0:
      return "info"; // 黄色
    case 1:
      return "warning"; // 绿色
    case 2:
      return "success"; // 红色
    case 3:
      return "info"; // 灰色
    case 4:
      return "primary"; // 蓝色
    case 5:
      return "warning"; // 红色
    case 6:
      return "danger";
    default:
      return ""; // 默认无颜色
  }
};

  // 🔍 搜索条件
  const searchData = reactive({
    name: "",
    params: {
      nickname: "",
      beginTime: "",
      endTime: "",
    },
    status: "",
    subcategoryId: "",
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
    pageSize: 7,
  });
  
  watch(() => pageParams.pageNum, () => {
    fetchArtworks();
  });
  const totalArtworks = ref(0);
  
  // 📡 获取艺术品数据
  const fetchArtworks = async () => {
    try {
      const res = await getArtworks(searchData, pageParams);
      totalArtworks.value = res.total;
      artworks.value = res.rows;
    } catch (error) {
      console.error("获取艺术品列表失败", error);
    }
  };
  
  // 📡 获取类别数据
  const fetchCategoryList = async () => {
    try {
      const res = await getSubCategories();
      categories.value = res.data;
    } catch (error) {
      console.error("获取类别失败", error);
    }
  };
  
  const ArtworkDetail = ref({})
  // 📌 查看艺术品详情
  const viewArtworkDetail = (artwork) => {
    getArtworkDetail(artwork.artworkId).then(res => {
      console.log(res.data);
      ArtworkDetail.value = res.data;
      drawerVisible.value = true;
    })
  };

  
  // 🔄 组件加载时获取数据
  onMounted(() => {
    fetchArtworks();
    fetchCategoryList();
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
  