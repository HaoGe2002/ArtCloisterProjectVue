<template>
  <HeaderBar />
  <div class="artwork-detail">
    <div class="artwork-content">

      <div class="left-section" height="100%">
        <div ref="customDialogContainer" class="banner-container">
          <el-image 
            v-for="(banner, index) in bannerList" 
            :src="`${!isPreview ? getImageUrl(banner) : getImageUrl(banner)}`" 
            :key="index"  
          />                  
        </div>
      </div>

      <el-scrollbar class="right-section">
        <ArtSimpleCard
          v-if="user.userId"
          @close="emitClose"  
          :artwork="artwork" 
          :user="user" 
          :isPreview="isPreview"
          :favorites="favorites"
          :browsing = "browsing"
        />
        <el-card class="artwork-card">
          <div><span style="font-size: 18px; font-weight: bold;">描述</span></div>
          <div class="artwork-desc">
            <span v-html="artwork.introduction"></span>
          </div>
        </el-card>

        <el-card class="artwork-card">
          <artComments 
          v-if="artworkId"
          :artworkId="artworkId" 
          :isPreview="isPreview"
          ></artComments>
        </el-card>

        <el-card class="artwork-card">
          <div><span style="font-size: 18px; font-weight: bold;">标签</span></div>
          <div style="margin-top: 30px;">
            <el-check-tag  v-for="tag in tags" :key="tag.tagId" type="info" effect="light" style="margin: 5px 5px; " >
              #{{ !isPreview ? tag.name : tag}}
            </el-check-tag>
          </div>
        </el-card>

        <el-card class="artwork-card">
          <div><span style="font-size: 18px; font-weight: bold;">报告</span></div>
          <div class="flag-container" style="height: 100px;">
              <el-button class="flag-btn">
                <el-icon><Flag /></el-icon> 
              </el-button>
          </div> 
        </el-card>

      </el-scrollbar>

    </div>
  </div>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import {getArtworkDetail} from '@/api/artwork/artwork.js';
import { getImageUrl } from '@/utils/utils';
import { Flag } from '@element-plus/icons-vue'
import ArtSimpleCard from './artSimpleCard.vue';
import HeaderBar from '@/components/Pages/mune/header.vue';


const route = useRoute(); // 获取当前路由信息
const router = useRouter();

const props = defineProps({
  artworkData: { type: Object, default: null },
  artworkId: { type: [Number, String], default: null ,required: true},
  isPreview: { type: Boolean, default: false },
})

const emit = defineEmits(['close','goToMoreOpus']); 
const user = ref({});
const tags = ref([]);
const artwork = ref({});
const bannerList = ref([]);
const browsing = ref(0)
const favorites = ref(0);
const frameOptions = ref([]); // 装裱选项列表

const subcategory = ref({})
const loadArtDetail = async () => {
  if(!props.isPreview){
      let selectArtId = props.artworkId;
      getArtworkDetail(selectArtId).then((res) => {
        const data = res.data;
        user.value = data.user;
        tags.value = data.artworkTags;
        artwork.value = data.artwork;
        subcategory.value = data.artworkSubcategories;
        bannerList.value = data.imageUrls;
        browsing.value = data.browsing;
        favorites.value = data.favorites;


        console.log(data);
      })
      
  }else{
    console.log('preview');
  }

}

const emitClose = () => {
  if (typeof props.artworkId === 'number') {
    emit('close');
    return;
  }
  router.push('/')
};

onMounted(() => {
  loadArtDetail()
});

</script>

<style scoped lang="scss">
.el-dialog__body{
  padding: 0px;
}

.artwork-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* 允许内容换行 */
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  padding: 20px;
  margin-top: 10px;
  /* 用户信息卡片 */
  .left-section {
    width: calc(100%);
    min-width: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
    border-radius: 10px;
    margin-right: 400px;
    .banner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      padding: 10px 0px;
    }
  }
  
}
.user-info-card {
  order: 1; /* 在大屏幕时保持在右侧 */
  width: 100%; /* 默认占右侧宽度 */
  display: none;
}

.right-section {
  width: 400px; /* 右侧区域宽度 */
  position: fixed; /* 使用 sticky 定位 */
  height: 100%;
  right: 15px;
  .artwork-card {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 0px 13px;
    margin-bottom: 20px;
    .more-artwork-container{
      width: 100%;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 将容器设置为3列的九宫格 */
      gap: 10px; /* 网格之间的间距 */
      .art-item {
        cursor: pointer;
        width: 100%; /* 宽度自适应 */
        padding-bottom: 100%; /* 设置底部填充为100%以维持正方形比例 */
        position: relative; /* 相对定位，以便子元素绝对定位 */
        background-position: center;
        background-size: cover;
        background-color: #999;
        border-radius: 5px; /* 圆角 */
        text-align: center;
        transition: transform 0.3s, box-shadow 0.3s; /* 动画过渡效果 */
      }
      .art-item:hover {
        transform: translateY(-5px); /* 鼠标悬停时上移 */
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 鼠标悬停时阴影效果 */
      }
      .art-item > div {
        position: absolute; /* 绝对定位内容 */
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* 居中内容 */
      }
    }
  }
}
.flag-container{
  margin-top: 30px;
  .flag-btn {
    width: 100%;
  }
}
.el-image {
  max-width: 100%; /* 图片宽度自适应 */
}
.info-section {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}
.info-item {
  display: flex;
  align-items: center;
  gap: 5px;
}
/* 响应式调整 */
@media (max-width: 1150px) {
  .artwork-content {
    flex-direction: column;
  }
  .left-section {
    width: 100%;
    margin-right: 0;
  }
  .right-section {
    position: static;
    width: 100%;
  }
  /* 调整顺序：在小屏幕下，将用户信息卡片移到顶部 */
  .user-info-card {
    order: -1; /* 将用户信息卡片移到最顶部 */
    display: block;
  }
  .right-user-info-card{
    display: none;
  }
}
</style>