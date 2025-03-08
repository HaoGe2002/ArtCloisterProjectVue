<template>
    <div class="editing-art-list-with-filters">
      <!-- 筛选区域 -->
      <div class="filters">
        <el-select v-model="selectedStatus" placeholder="请选择状态" clearable style="margin-right: 10px; width: 30%;">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="status in statuses"
            :key="status.statusId"
            :label="status.statusName"
            :value="status.statusId"
          />
        </el-select>
  
        <el-select v-model="timeOrder" placeholder="时间排序" clearable style="margin-right: 10px; width: 30%;">
          <el-option label="时间倒序" value="desc" />
          <el-option label="时间顺序" value="asc" />
        </el-select>
  
        <el-input
          v-model="searchKeyword"
          placeholder="搜索艺术品名称"
          clearable
          style="margin-right: 10px; width: 200px;"
        >

        </el-input>
  
        <el-button type="primary" @click="applyFilters">筛选</el-button>
        <el-button type="primary" @click="newArtwork">新建艺术品</el-button>
      </div>
  
      <!-- 列表区域 -->
      <div class="list">
        <div class="list-item" v-for="item in filteredItems" :key="item.artworkId">
          <div class="item-image">
            <el-image :src="item.coverImage ? getImageUrl(item.coverImage) : 'https://via.placeholder.com/150'" alt="封面图" />
          </div>
          <div class="item-details">
            <div class="item-header">
              <h3>{{ item.name }}</h3>
              <span class="status">状态: {{ item.status.statusName}}</span>
            </div>
            <div class="stats">
              <span>浏览: {{ item.browsing }}</span>
              <span>收藏: {{ item.favorites }}</span>
            </div>
            <div class="actions">
              <el-button 
              v-if="item.status.statusId === ArtworkStatusEnum.UNREVIEWED 
              || item.status.statusId === ArtworkStatusEnum.REJECTED 
              || item.status.statusId === ArtworkStatusEnum.UNLISTED 
              || item.status.statusId === ArtworkStatusEnum.APPROVED" 

              type="danger" 
              size="small" 
              @click="deleteItem(item.artworkId)">
              删除</el-button>

              <el-button 
                v-if="item.status.statusId === ArtworkStatusEnum.UNREVIEWED 
                || item.status.statusId === ArtworkStatusEnum.REJECTED 
                || item.status.statusId === ArtworkStatusEnum.APPROVED 
                || item.status.statusId === ArtworkStatusEnum.UNLISTED" 

                type="primary" size="small" 
                @click="selectItem(item.artworkId)"
              >编辑</el-button>

              <el-button
                v-if="getActionLabel(item.status.statusId)"
                type="primary"
                size="small"
                @click="actionItem(item)"
              >
                {{ getActionLabel(item.status.statusId) }}
              </el-button>

            </div>

          </div>
        </div>
      </div>
  
      <div v-if="filteredItems.length === 0" class="no-data">
        <el-empty description="暂无数据" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { ElMessage } from 'element-plus';
  import { getImageUrl } from '@/utils/utils';
  import {getAllStatuses} from '@/api/artwork/statuses';
  import { getArtworkList,deleteArtwork ,setArtworkStatus} from '@/api/artwork/artwork';
  import { useRouter } from 'vue-router'
  import {ArtworkStatusEnum,} from '@/enums/artworkStatusEnum'
  const router = useRouter()

  const props = defineProps({
    userId: { type: Number, default: null },
  })

  const newArtwork = () => {
    router.push("/physical")
  }

  // 模拟数据，实际开发中应从 API 获取
  const items = ref([]);
  // 枚举状态数组
  const statuses = ref([]);
  
  const loadAllStatuses = () => {
    getAllStatuses().then(res => {
      statuses.value = res.data;
    })
  }

  const loadArtworkList = () => {
    getArtworkList({
      userId: props.userId,
      keyword: '',
    }).then(res => {
        console.log(res)
      items.value = res.artworks.list;
    })
  }

  const selectItem = (artworkId) =>{
    router.push("/physical/"+ artworkId)
  }
  // 筛选条件
  const selectedStatus = ref("");
  const timeOrder = ref('desc'); // 默认倒序
  const searchKeyword = ref('');
  
  // 模拟的筛选与排序函数
  const filteredItems = computed(() => {
    let result = items.value;
    
    // 状态筛选：如果选择了具体状态则过滤
    if (selectedStatus.value) {
      result = result.filter(item => item.status === selectedStatus.value);
    }
    // 关键字搜索：按艺术品名称模糊匹配
    if (searchKeyword.value) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    }
  
    return result;
  });
  
  // 应用筛选操作
  const applyFilters = () => {
    // 实际开发中可以触发 API 数据重新加载，本示例仅使用前端过滤
    console.log('筛选条件：', selectedStatus.value, timeOrder.value, searchKeyword.value);
  };
  
  // 操作按钮标签逻辑，根据当前状态决定操作文案
  const getActionLabel = (status) => {
    if(status === ArtworkStatusEnum.UNREVIEWED || status === ArtworkStatusEnum.REJECTED || status === ArtworkStatusEnum.UNLISTED){
      return '提交审核';
    }else if(status === ArtworkStatusEnum.LISTED){
      return '下架';
    }
    switch(status) {
      case ArtworkStatusEnum.UNREVIEWED || status === ArtworkStatusEnum.REJECTED:
        return '提交审核';
      case ArtworkStatusEnum.APPROVED:
        return '上架';
      case 3:
        return '重新审核';
    }
  };
  

  
  // 删除操作
  const deleteItem = (artworkId) => {
    deleteArtwork(artworkId).then (res => {
      ElMessage.success('删除成功');
      loadArtworkList();
    })
  };
  
  // 操作按钮点击事件：根据当前状态更新状态（模拟效果，实际调用 API）
  const actionItem = (item) => {
    if (item.status.statusId === ArtworkStatusEnum.UNREVIEWED 
    || item.status.statusId === ArtworkStatusEnum.REJECTED 
    || item.status.statusId === ArtworkStatusEnum.UNLISTED) {

      setArtworkStatus(item.artworkId,ArtworkStatusEnum.UNDER_REVIEW).then (() => {
        ElMessage.success('提交审核成功');
        loadArtworkList();
      })

    }else if(item.status.statusId === ArtworkStatusEnum.LISTED 
    || item.status.statusId === ArtworkStatusEnum.SOLD){
      
      setArtworkStatus(item.artworkId,ArtworkStatusEnum.UNLISTED).then (() => {
        ElMessage.success('下架成功');
        loadArtworkList();
      })

    }else if(item.status.statusId === ArtworkStatusEnum.APPROVED){

      setArtworkStatus(item.artworkId,ArtworkStatusEnum.LISTED).then (() => {
        ElMessage.success('上架成功');
        loadArtworkList();
      })

    }
  };


  // **初始化加载**
onMounted(() => {
    loadArtworkList();
    loadAllStatuses();
});

</script>
  
<style scoped lang="scss">
  .editing-art-list-with-filters {
    padding: 20px;
  }
  .filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .list-item {
    display: flex;
    padding: 15px;
    background: var(--art-light);
    border: 1px solid var(--art-border-color);
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  .item-image {
    flex-shrink: 0;
    width: 150px;
    height: 100px;
    overflow: hidden;
    border-radius: 4px;
    margin-right: 15px;
  }
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .item-header h3 {
    margin: 0;
    font-size: 18px;
    color: #303133;
  }
  .status {
    font-size: 14px;
    color: #909399;
  }
  .introduction {
    font-size: 14px;
    margin-bottom: 10px;
  }
  .stats {
    font-size: 12px;
    color: #909399;
    margin-bottom: 10px;
  }
  .stats span {
    margin-right: 15px;
  }
  .actions {
    display: flex;
    gap: 10px;
  }
  .no-data {
    text-align: center;
    margin-top: 20px;
  }
</style>
  