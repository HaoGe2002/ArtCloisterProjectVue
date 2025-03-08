<template>
    <div class="search-container">
      <h1 class="title">艺术品搜索</h1>
  
      <!-- 搜索条件 -->
      <el-form :inline="true" class="search-form">
        <!-- 名称搜索 -->
        <el-form-item label="名称">
          <el-input v-model="searchParams.name" placeholder="输入艺术品名称..." clearable />
        </el-form-item>
        
        <!-- 作者筛选 -->
        <el-form-item label="作者">
          <el-input v-model="searchParams.params.nickname" placeholder="输入作者名称..." clearable />
        </el-form-item>

        <!-- 类型筛选 -->
        <el-form-item label="类型">
          <el-select v-model="searchParams.subcategoryId" placeholder="选择类型" clearable style="width: 200px;">
            <el-option v-for="category in categories" :key="category.subcategoryId" :label="category.subcategoryName" :value="category.subcategoryId" />
          </el-select>
        </el-form-item>
  
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
        


        <!-- 价格区间 -->
        <el-form-item label="价格区间">
          <el-input-number v-model="searchParams.params.minPrice" placeholder="最低价" :min="0" />
          <span class="price-separator"> - </span>
          <el-input-number v-model="searchParams.params.maxPrice" placeholder="最高价" :min="0" />
        </el-form-item>
  
        <!-- 尺寸筛选 -->
        <el-form-item label="尺寸 (cm)">
          <el-input-number v-model="searchParams.width" placeholder="宽度" :min="0" />
          <el-input-number v-model="searchParams.height" placeholder="高度" :min="0" />
          <el-input-number v-model="searchParams.length" placeholder="长度" :min="0" />
        </el-form-item>
  
        <!-- 搜索按钮 -->
        <el-form-item>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-divider />
        <!-- 传递搜索参数到 ArtList 组件 -->
        <ArtList
            :paramDate="searchParams"
            />
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {getSubCategories} from "@/api/type/type";
import ArtList from "@/components/Pages/artlist/digitArtList.vue";

  const router = useRouter();
  
// 搜索参数
const searchParams = ref({
  name: "",
  subcategoryId: null,
  status: 4,
  width: null,
  height: null,
  length: null,
  params: {
      nickname: "",
      beginTime: "",
      endTime: "",
      minPrice: null,
      maxPrice: null,
      tagName: "",
    },
});

const dateRange = ref([]);
const handleDateChange = (val) => {
    if (val && val.length === 2) {
        searchParams.value.params.beginTime = val[0];
        searchParams.value.params.endTime = val[1];
    } else {
        searchParams.value.params.beginTime = "";
        searchParams.value.params.endTime = "";
    }
  };

  // 分类数据
const categories = ref([]);
  
  // 获取分类
  // 📡 获取类别数据
  const fetchCategoryList = async () => {
    try {
      const res = await getSubCategories();
      categories.value = res.data;
    } catch (error) {
      console.error("获取类别失败", error);
    }
  };
  
  
  // 重置搜索条件
  const resetSearch = () => {
    searchParams.value = {
        name: "",
        subcategoryId: null,
        status: 4,
        width: null,
        height: null,
        length: null,
        params: {
            nickname: "",
            beginTime: "",
            endTime: "",
            minPrice: null,
            maxPrice: null,
            tagName: "",
        },
    };
  };
  
  
  // 组件加载时获取分类
  onMounted(() => {
    fetchCategoryList();
  });
</script>
  
<style scoped>
  .search-container {
    width: 90%;
    margin: 20px auto;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .search-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .price-separator {
    margin: 0 10px;
  }
  
  .artwork-card {
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .artwork-image {
    width: 100%;
    height: 180px;
  }
  
  .artwork-info {
    padding: 10px;
  }
  
  .artwork-name {
    font-size: 16px;
    font-weight: bold;
  }
  
  .artwork-author {
    font-size: 14px;
    color: gray;
  }
  
  .artwork-price {
    font-size: 18px;
    font-weight: bold;
    color: #c44;
  }
  
  .no-data {
    text-align: center;
    font-size: 18px;
    color: gray;
  }
</style>
  