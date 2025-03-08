<template>
  <div>
    <HeaderBar />
      <div class="container">
          <div class="avatar-container">
              <el-avatar shape="square" :size="100" :src="userInfo.avatar" />
          </div>
          <div class="info-container">
              <div class="text-name">
                  {{ userInfo.nickname }}
                  <el-popover
                      v-if="isCurrentUser"
                      :width="200"
                      :title="`余额: ￥${userInfo.balance}`"
                      content="您可以使用余额来购买商品、充值、提现等。"
                  >
                      <template #reference>
                          <div class="text-money">
                              <el-button
                                  color="#626aef"
                                  link
                                  style="text-shadow: 0 0 5px rgba(0, 0, 0, 0.8); font-weight: bold; font-size: large;"
                              >
                                  <el-icon :size="25" style="margin-right: 5px;"><WalletFilled /></el-icon>
                                  <div style="margin-top: 5px;">{{ userInfo.balance }}</div>
                              </el-button>
                          </div>
                      </template>
                  </el-popover>
              </div>
              <div class="text-email">
                  {{ userInfo.email }}
              </div>
              <div class="settings-data">
                  <el-button
                      v-if="isCurrentUser"
                      type="primary"
                      size="small"
                      style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.8); margin-bottom: 2px;"
                      @click="router.push('/edit_user')"
                  >
                      编辑个人资料
                  </el-button>
                  <el-button
                        v-if="!isCurrentUser"
                        :type="isFollowing ? 'danger' : 'primary'"
                        size="small"
                        style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.8); margin-bottom: 2px;"
                        @click="toggleFollow"
                        >
                        {{ isFollowing ? '取消关注' : '关注' }}
                  </el-button>
                  <el-button
                      color="#626aef"
                      link
                      style="text-shadow: 0 0 20px rgba(0, 0, 0, 0.8); font-weight: bold; font-size: large;"
                  >
                      {{FollowersCount}} 粉丝
                  </el-button>
                  <el-button
                      color="#626aef"
                      link
                      style="text-shadow: 0 0 20px rgba(0, 0, 0, 0.8); font-weight: bold; font-size: large;"
                  >
                      {{FollowingCount}} 关注
                  </el-button>
              </div>
          </div>
      </div>
      <personMnue 
      v-if="userInfo.userId" 
      :userId = "userInfo.userId"
      :isCurrentUser = "isCurrentUser"
      />

  </div>
</template>

<script setup>
import HeaderBar from '@/components/Pages/mune/header.vue';
import { WalletFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {useUserStore} from '@/store/modules/userStore'
import { useRouter , useRoute } from 'vue-router'
import {getFollowingCount,getFollowersCount,isFollowingState,unfollowUser,followUser} from '@/api/user/follow'

import { ref } from 'vue';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userInfo = ref({})

//关注
const FollowingCount = ref()
//粉丝
const FollowersCount = ref()

const userId = computed(() => userStore.info.userId)

const isFollowing = ref(false); // 是否已关注

// 页面加载时执行
onMounted(async () => {
  await loadUserInfo();
});


// ✅ 关注 / 取消关注
const toggleFollow = async () => {
  if (!userInfo.value.userId) return;
  const targetUserId = userInfo.value.userId;
  try {
    if (isFollowing.value) {
      await unfollowUser(targetUserId);
      ElMessage.success('已取消关注');
      FollowersCount.value--; // 粉丝数 -1
    } else {
      await followUser(targetUserId);
      ElMessage.success('关注成功');
      FollowersCount.value++; // 粉丝数 +1
    }
    isFollowing.value = !isFollowing.value; // 更新状态
  } catch (error) {
    console.error("操作失败:", error);
    ElMessage.error('操作失败，请重试');
  }
};
// 检查是否已关注该用户
const checkFollowStatus = async (userId) => {
  if (!userId || !userStore.info.userId) return;
  try {
    const res = await isFollowingState( userId);
    isFollowing.value = res.data;
  } catch (error) {
    console.error("获取关注状态失败:", error);
  }
};

// 监听 userId 变化
watch(() => route.params.userId, (newUserId, oldUserId) => {
  if (newUserId !== oldUserId) {
    loadUserInfo();
  }
});

// 加载用户信息的函数
const loadUserInfo = async () => {
  let userId = route.params.userId; // ✅ 获取路由参数中的 userId
  if (isCurrentUser.value) {
    // ✅ 获取当前登录用户的信息
    userStore.getInfo().then(res => {
      userInfo.value = res;
      fetchFollowCounts(userInfo.value.userId); // ✅ 等待用户信息加载完成后再获取关注/粉丝数量
    }).catch(err => {
      useUserStore().logOut().then(() => {
        ElMessage.error(err);
        router.push(`/login?redirect=${route.fullPath}`);
        console.log(err + ' 登录信息已过期，请重新登录');
      });
    });
  } else {
    // ✅ 获取其他用户的信息
    userStore.getUser(userId).then(res => {
      userInfo.value = res;
      fetchFollowCounts(userInfo.value.userId); // ✅ 等待用户信息加载完成后再获取关注/粉丝数量
      checkFollowStatus(userInfo.value.userId); // ✅ 获取关注状态
    }).catch(err => {
      // console.error(err);
      router.push('/404');
    });
  }
};

// 获取用户的关注数 & 粉丝数
const fetchFollowCounts = async (userId) => {
  if (!userId) return; // ✅ 避免请求 userId 为空的情况

  try {
    const [followingRes, followersRes] = await Promise.all([
      getFollowingCount(userId),
      getFollowersCount(userId),
    ]);
    FollowingCount.value = followingRes.data; // ✅ 赋值关注数量
    FollowersCount.value = followersRes.data; // ✅ 赋值粉丝数量
  } catch (error) {
    console.error("获取关注或粉丝数量失败:", error);
  }
};


//检查是否本人打开该页面
const isCurrentUser =  computed(() => {
  const currentUserId = route.params.userId
  const loggedInUserId = userId.value
  return String(loggedInUserId) === currentUserId;
})

</script>


<style scoped lang="scss">
.container {
  display: flex;
  padding: 50px 0; /* 给容器内边距 */
  align-items: center; /* 让子元素垂直居中 */
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 10vw; /* 设置容器高度为整个页面 */
  max-height: 100px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.8); /* 阴影 */
  background-size: cover; /* 背景图片铺满容器 */
  background-repeat: no-repeat; /* 背景不重复 */
  background-position: center center; /* 背景居中显示 */
  background-image: url('@/assets/img/background/personBackground.jpg');
  z-index: -1; /* 将容器放在最底层 */
  color: #fff; /* 字体颜色 */
  .info-container{
    margin:10px ;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: left;
    .text-name {
        font-size: 25px;
        color: #fff;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text-money {
            font-size: 20px;
            margin-left: 10px;
            display: flex;
            align-items: center;
        }
     }
     .text-email {
        font-size: 15px;
        color: #cacaca;
    }
    .settings-data {
        margin-top: 24px;
    }
  }
}
</style>