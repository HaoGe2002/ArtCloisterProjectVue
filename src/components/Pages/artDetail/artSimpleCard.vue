<template>
    <el-card class="artwork-card">
      <div class="artwork-info-content">
        <div style="display: flex;">
            <el-avatar shape="square" @click="userDetail(user.userId)" :size="70" 
            :src="user.avatar ? getImageUrl(user.avatar):defAva" />
            <div class="artwork-info-content-text">
                <span style="font-size: 25px;"> {{ user.nickname }}</span>
                <el-button 
                    v-if="!isCurrentUser" 
                    :size="'small'" 
                    @click="handleFollow" 
                    style="width: 60px; margin-top: 2px;"
                >
                {{ isFollowing ? '取消关注' : '关注' }}
              </el-button>
            </div>
        </div>
        <div >
            <el-icon class="close-btn" @click="$emit('close')" v-if="!isPreview"><Close /></el-icon>
        </div>
      </div>
      <div class="star-container" >
          <el-button class="star-btn" 
          @click="thisCollected ? handleUncollect() : handleCollect()"
          >
            <el-icon><Star /></el-icon>
            <span style="color:gray;" :size="'large'">
              {{ thisCollected ? '取消收藏' : '收藏' }}
            </span>
          </el-button>

          <el-button type="primary" class="star-btn" @click="$emit('addToCart')">
            <el-icon><ShoppingCart /></el-icon>
            <span :size="'large'" >加入购物车</span>
          </el-button>
      </div>  

      <div class="artwork-title">
        <div class="artwork-title-content">
          <div>
            <h2 style="margin-bottom: 4px;">{{ artwork.title }}</h2>
            <span >{{ artwork.briefly }}</span>
            <div style="margin-top: 15px;">
              <div style="margin-bottom: 10px;">
                <span>线上艺术/ai艺术/{{ artwork.title }}</span>
              </div>

            <span style="color: gray; font-size: 14px;font-style: italic ;">发布于:{{parseTime(artwork.createdAt)}}</span>
            </div>
          </div>
          <div>
            <h2 style="margin-bottom: 4px; color:rgb(3, 173, 252) ;">￥{{artwork.price}}</h2>
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <div class="info-item">
          <el-icon><View /></el-icon>
          <span>{{ browsing }}</span>
        </div>
        <div class="info-item">
          <el-icon><Star /></el-icon><br>
          <span>{{ favorites}}</span>
        </div>
      </div>
    </el-card>
</template>

<script setup>
import { getImageUrl,parseTime } from '@/utils/utils';
import { View, Star, Close, ShoppingCart } from '@element-plus/icons-vue';
import defAva from '@/assets/img/avatar/avatar.png'
import {isFavorite,addFavorite,cancelFavorite} from '@/api/artwork/favorites';
import { ElMessage } from 'element-plus';
import {isFollowingState,followUser ,unfollowUser} from '@/api/user/follow';
import { useUserStore } from '@/store/modules/userStore';
const store = useUserStore();

const props = defineProps({
    artwork: { type: Object, default: null },
    user: { type: Object, default: null },
    isPreview: { type: Boolean, default: false },
    favorites: {type:Number, default: 0},
    browsing:{type:Number, default: 0}   
})

const { artwork, user, isPreview } = toRefs(props);

const isFollowing = ref(false);
const isCurrentUser = ref(false);
const thisCollected = ref(false);

// 检查是否已关注
const checkFollowStatus = async () => {
  if(user.value.userId === store.info.userId){
    isCurrentUser.value = true;
    return;
  }
  isFollowingState(props.user.userId).then((res) =>{
    isFollowing.value = res.data;
  })
}

const handleFollow = () =>{
  if (isFollowing.value) {
    unfollowUser(props.user.userId).then(() => {
      ElMessage.success('已取消关注');
      isFollowing.value = false;
    })
  }else{
    followUser(props.user.userId).then((res) =>{
      ElMessage.success('关注成功');
      isFollowing.value = true;
    })
  }

}


const handleCollect = async () => {
  addFavorite(artwork.value.artworkId).then(() => {
    ElMessage.success('收藏成功');
    thisCollected.value = true;
  })
  
};

const handleUncollect = async () => {
  cancelFavorite(artwork.value.artworkId).then(() => {
    ElMessage.success('您已取消收藏');
    thisCollected.value = false;
  })
  
}

const checkCollectedStatus = async () => {
  const params = {
    artworkId: artwork.value.artworkId,
  }
  isFavorite(params).then((response) => {
    thisCollected.value = response.data
  })
}

onMounted(() => {
  checkCollectedStatus();
  checkFollowStatus()
})

</script>

<style scoped lang="scss">
.artwork-card {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 0px 13px;
  margin-bottom: 20px;
}

.star-container{
  display: flex;
  margin-top: 30px;
  .star-btn {
    width: 50%;
  }
}
.artwork-title-content{
  display: flex;
  justify-content: space-between;
}
.artwork-info-content {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.artwork-info-content-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
}
.close-btn{
    cursor: pointer;
    transition: 1s;
    &:hover{
        color: rgb(3, 173, 252);
    }
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

</style>