<template>
    <div class="art_print_container">
    <div class="art_print_box">
        <div v-if="!isPreview">
            <!-- <el-icon><Close /></el-icon> -->
        </div>
        <div class="art_print_content">
            <div class="art_print_content_left">
                <div class="image_container">
                    <div class="image_list">
                        <img
                            v-for="image in bannerList"
                            :key="image.index"
                            :src="getImageUrl(image)"
                            @click="setImage(image)"
                            class="thumbnail"
                        />
                    </div>
                    <div
                        class="image_box"
                        @click="toggleZoom"
                        @mousemove="handleMouseMove"
                        @mouseleave="resetZoom"
                        :class="{ zoomed: isZoomed }"
                        ref="imageBox"
                        :style="{ backgroundImage: `url(${getImageUrl(selectedImage)})` }"
                    ></div>
                </div>
                <div style="margin-top: 20px;">
                    <h3>标签</h3>
                    <div>
                        <el-check-tag v-if="!isPreview" style="margin: 5px 5px 0 0 ;" :size="'large'" type="info" v-for="Tag in tags" :key="Tag.tagId">
                        #{{ Tag.name }}
                        </el-check-tag>
                        <el-check-tag v-else style="margin: 5px 5px 0 0 ;" :size="'large'" type="info" v-for="Tag in tags" :key="Tag.index">
                        #{{ Tag }}
                        </el-check-tag>
                    </div>
                </div>
                <div style="margin-top: 40px;">
                    <h3>详情</h3>
                    <div style="font-size: 14px;color: #bebec2">
                        <span v-html="artwork.introduction"></span>
                    </div>
                </div>

            </div>
            <div class="art_print_content_right">
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <h3 style="margin-top: 0; margin-bottom: 8px; font-size: 28px;">{{ artwork.name }}</h3>
                        <el-icon class="close-btn" @click="$emit('close')" v-if="!isPreview"><Close /></el-icon>
                    </div>

                    <div style="display:  flex; align-items: center; gap: 8px; " v-if="!isPreview">
                        <el-avatar shape="square" style="cursor:pointer;" :size="27" :src="getImageUrl(user.avatar)"  @click="userDetail(user.userId)"/>
                        <span style="font-size: 13px; color: cornflowerblue;">
                            {{ user.nickname }}
                        </span>
                    </div>

                    <el-button class="star-btn" v-if="!isPreview"
                      @click="thisCollected ? handleUncollect() : handleCollect()"
                      >
                        <el-icon><Star /></el-icon>
                        <span style="color:gray;" :size="'large'">
                          {{ thisCollected ? '取消收藏' : '收藏' }}
                        </span>
                      </el-button>
                    <div style="margin-top: 20px;" v-if="!subcategory.is3d">
                    <span style="color: #bebec2; font-size: 14px;">选择画框装裱：</span>
                        <div class="frame-dropdown">
                        <!-- 触发器：显示当前选中的装裱信息 -->
                            <div class="dropdown-trigger" @click="toggleDropdown">
                            <img :src="selectedFrame.imageUrl ? getImageUrl(selectedFrame.imageUrl) : defAva " class="selected-frame-thumbnail" />
                            <div class="selected-frame-info">
                                <span>{{ selectedFrame.frameTypeName }}</span>
                                <span>+ ￥{{ selectedFrame.price }}</span>
                            </div>
                            <i :class="dropdownOpen ? 'arrow-up' : 'arrow-down'"></i>
                            </div>

                            <!-- 下拉菜单 -->
                            <div v-show="dropdownOpen" class="dropdown-menu">
                            <div 
                                class="frame-option" 
                                v-for="frame in frameOptions" 
                                :key="frame.frameTypeId" 
                                @click="selectFrame(frame)"
                            >
                                <img :src="frame.imageUrl ? getImageUrl(frame.imageUrl) : defAva " class="frame-thumbnail" />
                                <div class="frame-info">
                                    <span>{{ frame.frameTypeName }}</span>
                                    <span>+ ￥{{ frame.price }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                    
                    <div style="margin-top: 20px;">
                        <span style="color: #bebec2; font-size: 14px;">艺术品大小：</span><br>
                        <div style="margin-top: 10px;display: flex;justify-content: center;cursor: pointer; ">
                        <el-card style="width: 100%;display: flex;justify-content: center;align-items: center;color: #bebec2;" shadow="hover">
                            <div style="width: 100%;display: flex;justify-content: center;align-items: center;">
                            <el-icon style="font-size: 20px;"><Crop /></el-icon>
                            <div>
                                <span> {{ artwork.width }} * {{ artwork.height }}</span><span v-if="artwork.length"> * {{ artwork.length }}</span><span> CM</span>
                            </div>
                            </div>
                        </el-card>
                        </div>
                    </div>
                                        
                    <div style="margin-top: 20px;">
                      <span style="color: #bebec2; font-size: 14px;">艺术品类型：</span><br>
                      <div style="margin-top: 10px;">
                        <span style="font-size: 20px;">{{ subcategory.subcategoryName }}</span><br>
                        <span style="font-size: 12px;">{{ subcategory.remark }}</span>
                      </div>
                      
                    </div>
                        


                    <div style="margin-top: 20px;">
                        <span style="color: #bebec2; font-size: 14px;">总计：</span><br>
                        <h2 style="margin-top: 5px;">￥{{ artwork.price + selectedFrame.price }}</h2>
                    </div>

                    <div style="margin-top: 20px;">
                        <el-button :size=" 'large'" type="primary" @click="addToCart" style="width: 100%;">
                            <el-icon><ShoppingCart /></el-icon>
                            <span :size=" 'large'" >加入购物车</span>
                        </el-button>
                        <div style="display:flex;align-items: center;margin-top: 5px;">
                            <span style="color: #bebec2; font-size: 12px;">此产品全国发货</span> 
                            <el-tooltip content="Bottom center" placement="bottom" effect="light">
                            <el-icon style="font-size: 14px;"><QuestionFilled /></el-icon>
                            </el-tooltip>
                        </div>

                        <div style="margin-top: 20px;">
                            <span style="color: #bebec2; font-size: 14px;">简介:</span><br>
                            <div style=" margin-top: 5px;">
                                <span style="color: #bebec2;">{{ artwork.description }}</span>
                            </div>
                        </div>

                        <div style="margin-top: 20px;">
                            <div style=" margin-top: 5px;">
                                <span style="font-style: italic;color: #999;">发布于:{{artwork.createdAt}}</span>
                            </div>
                        </div>

                        <div style="margin-top: 50px;">
                            <div style="display:flex;align-items: center;margin-top: 5px;">
                            <el-icon style="font-size: 14px;"><Flag /></el-icon>
                            <span style="color: #bebec2; font-size: 12px;">举报该产品</span> 
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
        <div v-if="!isPreview" style="margin-top: 30px;">
            <h3>评论</h3>
            <artComments
                v-if="artworkId"
                :artworkId="artworkId" 
                :isPreview="isPreview"
                @userClose="emit('close')"
                >
            </artComments>
        </div>
    </div>
</div>
</template>

<script setup>
import { Close, ShoppingCart, QuestionFilled, Flag, Crop,Star } from '@element-plus/icons-vue';
import {getArtworkDetail} from '@/api/artwork/artwork.js';
import { getImageUrl,parseTime } from '@/utils/utils';
import {selectAllFrames,addFrameToArtwork} from '@/api/frame/frame.js';
import {isFavorite,addFavorite,cancelFavorite} from '@/api/artwork/favorites';
import {addCartItem} from '@/api/cart/cart.js'
import { useRouter } from 'vue-router';
import defAva from '@/assets/img/artType/nullImage.png'
import {useUserStore} from '@/store/modules/userStore'
import { ElMessage } from 'element-plus';
// import { getFrame } from '@/api/frameModule';

const userStore = useUserStore()
const thisCollected = ref(false);
const router = useRouter();
const props = defineProps({
  artworkData: { type: Object, default: null },
  artworkId: { type: [Number, String], default: null ,required: true},
  isPreview: { type: Boolean, default: false },
})

const userDetail= (userId) => {
    router.push(`/personal/${userId}`)
}

const emit = defineEmits(['close','goToMoreOpus']); 

const user = ref({});
const tags = ref([]);
const artwork = ref({});
const subcategory = ref({});
const bannerList = ref([]);
const browsing = ref(0)
const favorites = ref(0);

const selectedFrame = ref({}); // 当前选中的装裱

const frameOptions = ref([]);
const selectedImage = ref(); // 当前选中的图片
const isZoomed = ref(false);
const dropdownOpen = ref(false); // 控制装裱选项菜单显示状态

const handleCollect = async () => {
  addFavorite(props.artworkId).then(() => {
    ElMessage.success('收藏成功');
    thisCollected.value = true;
  })
  
};

const handleUncollect = async () => {
  cancelFavorite(props.artworkId).then(() => {
    ElMessage.success('您已取消收藏');
    thisCollected.value = false;
  })
}

const checkCollectedStatus = async () => {
  if(!props.artworkId){
    return
  }
  const params = {
    artworkId: props.artworkId,
  }
  isFavorite(params).then((response) => {
    thisCollected.value = response.data
  })
}

const loadArtDetail = async () => {
  if(!props.isPreview){
      let selectArtId = props.artworkId;
      getArtworkDetail(selectArtId).then((res) => {
        const data = res.data;
        user.value = data.user;
        tags.value = data.artworkTags;
        artwork.value = data.artwork;
        bannerList.value = data.imageUrls;
        subcategory.value = data.artworkSubcategories;
        
        browsing.value = data.browsing;
        favorites.value = data.favorites;
        selectedImage.value = bannerList.value[0];
        selectAllFrames({status:1}).then ((res) => {
          frameOptions.value =  res.rows
          selectedFrame.value = frameOptions.value[frameOptions.value.length - 1];
        });
      })
  }else{
    console.log(props.artworkData)
    artwork.value.price = props.artworkData.price
    artwork.value.name = props.artworkData.name
    artwork.value.width = props.artworkData.width
    artwork.value.height = props.artworkData.height
    artwork.value.length = props.artworkData.length
    artwork.value.description = props.artworkData.description
    artwork.value.introduction = props.artworkData.introduction
    artwork.value.createdAt = parseTime(new Date().toISOString());
    subcategory.value = props.artworkData.category
    tags.value = props.artworkData.dynamicTags

    bannerList.value.push(props.artworkData.mainImage)
    if (props.artworkData.promoImages) {
        props.artworkData.promoImages.split(', ').forEach(image => {
            bannerList.value.push(image.trim());
        });
    }

    user.value.nickname = userStore.info.nickname
    user.value.avatar = userStore.info.avatar

    selectedImage.value = props.artworkData.mainImage


    selectAllFrames({status:1}).then ((res) => {
          frameOptions.value =  res.rows
          selectedFrame.value = frameOptions.value[frameOptions.value.length - 1];
    });
  }
}

const addToCart = () => {
  
  if(!props.isPreview){
    addCartItem(artwork.value.artworkId,selectedFrame.value.frameTypeId).then ((res) => {
    ElMessage.success(res.msg);
  });
  }else{
    ElMessage.success('测试添加成功')
  }

}

watch(() => props.artworkData,() => {
    fetchFrameOptions();
});

// --- 获取和初始化装裱选项 ---
const fetchFrameOptions = async () => {
  const response = await getFrame();
  frameOptions.value = response.data; 
  selectedFrame.value = frameOptions.value[0]
};

// 更新当前选中装裱的边缘和转角图片 URL
const selectFrame = (frame) => {
  selectedFrame.value = frame;
  dropdownOpen.value = false; // 关闭下拉菜单
  if (frame.imageUrl) {
      addFrameToArtwork(bannerList.value[0],frame.imageUrl).then((res)=>{
      const data = res.msg;
      console.log(res);
      selectedImage.value = getImageUrl(data);
    })
  }else{
    selectedImage.value = bannerList.value[0]
  }

};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  console.log('Dropdown toggled:', frameOptions.value);
};

// 切换图片
const setImage = (imageUrl) => {
  selectedImage.value = getImageUrl(imageUrl);
  isZoomed.value = false; // 重置放大状态
};

// 图片放大/缩小
const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

const handleMouseMove = (event) => {
  if (!isZoomed.value) return;
  const { offsetX, offsetY, target } = event;
  const { offsetWidth, offsetHeight } = target;
  const posX = (offsetX / offsetWidth) * 100;
  const posY = (offsetY / offsetHeight) * 100;
  target.style.backgroundPosition = `${posX}% ${posY}%`;
};

const resetZoom = () => {
  isZoomed.value = false;
};

onMounted(() => {
  loadArtDetail()
  checkCollectedStatus()
});
</script>

<style scoped lang="scss">
.star-btn{
  margin-top: 20px;
  width: 100%;
}
.close-btn{
    cursor: pointer;
    transition: 1s;
    &:hover{
        color: rgb(3, 173, 252);
    }
}
  .comment-container{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
  .more_art_box {
    width: 100%;
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(3, 1fr); /* 将容器设置为3列的九宫格 */
      gap: 10px; /* 网格之间的间距 */
      .art-item {
        width: 100%; /* 宽度自适应 */
        padding-bottom: 100%; /* 设置底部填充为100%以维持正方形比例 */
        position: relative; /* 相对定位，以便子元素绝对定位 */
        background-color: #575757; /* 背景颜色 */
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
  .art_print_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
  
    .art_print_box {
      width: 1400px;
      .art_print_header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 50px;
        margin-top: 50px;
      }
  
      .art_print_content {
        display: flex;
        justify-content: space-between;
        width: 100%;
  
        .art_print_content_left {
          width: 80%;
        .image_container{
            display: flex;
            justify-content: space-between;
          
          .image_list {
            width: 18%;
            height: 800px;
            display: flex;
            flex-direction: column;
            gap: 10px;
  
            .thumbnail {
              width: 100%;
              height: 150px;
              object-fit: cover;
              cursor: pointer;
              transition: transform 0.2s;
              border-radius: 5px;
              &:hover {
                transform: scale(1.05);
              }
            }
          }
  
          .image_box {
            width: 80%;
            height: 700px;
            background-size: 100%;
            background-position: center;
            transition: background-size 0.3s ease, background-position 0.1s ease;
            cursor: zoom-in;
            background-repeat: no-repeat;
            border-radius: 5px;
  
            &.zoomed {
              cursor: zoom-out;
              background-size: 200%;
            }
          }
        }
      }
        .art_print_content_right {
          padding: 0 0 0 20px;
          width: 20%;
          .frame-dropdown {
            margin-top: 10px;
            background-color: #2c2c2c;
            cursor: pointer;
            position: relative;
            padding: 10px;
            border-radius: 3px;
            .dropdown-trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
            }

            .selected-frame-thumbnail {
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 8px;
            }

            .selected-frame-info {
                display: flex;
                flex-direction: column;
                flex: 1;
            }

            .arrow-down::before,
            .arrow-up::before {
                content: '';
                border: solid white;
                border-width: 0 2px 2px 0;
                display: inline-block;
                padding: 5px;
                transition: transform 0.2s;
            }

            .arrow-down::before {
                transform: rotate(45deg);
            }

            .arrow-up::before {
                transform: rotate(-135deg);
            }

            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: #3c3c3c;
                margin-top: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                z-index: 10;
                border-radius: 3px;
            }

            .frame-option {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                cursor: pointer;
                transition: all 0.2s;
                &:hover {
                background-color: #4c4c4c;
                }

                .frame-thumbnail {
                border-radius: 3px;
                width: 40px;
                height: 40px;
                object-fit: cover;
                }

                .frame-info {
                display: flex;
                flex-direction: column;
                }
            }
            }
        }
      }
    }
  }
</style>