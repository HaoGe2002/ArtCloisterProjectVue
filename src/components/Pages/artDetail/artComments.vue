<template>
    <span style="color: gray;">{{ total }}评论</span>
  
    <div 
      style="height:120px; display: flex; justify-content: center; align-items: center; font-size: 16px; color: gray;" 
      v-if="allComments.length === 0 && !loading">
      暂无评论
    </div>
  
    <div v-loading="loading" style="padding: 10px;">
      <div class="comment-container" v-for="comment in allComments" :key="comment.reviewId">
        <div style="display: flex;">
          <div>
            <el-avatar
              :size="40"
              style="margin-right: 10px; cursor: pointer"
              @click="userDetail(comment.userId)"
              :src="comment.avatarUrl ? getImageUrl(comment.avatarUrl) : defAva"
            />
          </div>
          <div style="width: 100%;">
            <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
              <span style="font-size: 14px; font-weight: bold;">{{ comment.nickname }}</span>
              <div style="color: gray; font-size: 12px;">
                {{ parseTime(comment.reviewTime) }}
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
              <span style="font-size: 12px; color: gray;">{{ comment.role ? comment.role : '用户' }}</span>
              <div style="display: flex; align-items: center;">
                <el-icon style="color: chocolate; font-size: 16px;">
                  <StarFilled />
                </el-icon>
                <span style="font-size: 12px;">{{ comment.rating }}</span>
              </div>
            </div>
            <div>
              <span style="font-size: 14px;">{{ comment.reviewContent }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <div>
      <el-button
        type="primary"
        style="width: 100%; margin-top: 10px;"
        v-if="allComments.length < total"
        @click="loadMoreComments"
      >
        查看更多评论<el-icon><CaretBottom /></el-icon>
      </el-button>
    </div>
    <el-divider />
    <div style="display: flex; align-items: center; gap: 10px;">
      <el-input
        placeholder="请写下您的评论"
        @keyup.enter.prevent="submitComment"
        v-model="textComment"
        style="width: 100%; height: 40px;"
      ></el-input>
  
      <el-button @click="submitComment" type="primary" style="width: 20%; height: 40px;">
        <el-icon style="font-size: 18px;">
          <Promotion />
        </el-icon>
      </el-button>
    </div>
    <el-rate v-model="fraction" />
  </template>
  
<script setup>
  import { ref } from 'vue';
  import { Promotion, CaretBottom, StarFilled } from '@element-plus/icons-vue';
  import { parseTime,getImageUrl } from '@/utils/utils';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  import { selectComments, sendComment } from '@/api/artwork/comments';
  import { useUserStore } from '@/store/modules/userStore'
  import defAva from '@/assets/img/avatar/avatar.png'

  
  const router = useRouter();
  defineEmits(['userClose']);
  const props = defineProps({
    artworkId: { type: [Number, String], default: null ,required: true},
    isPreview: { type: Boolean, default: false },
  });
  
  // 示例 userInfo（请从实际登录状态或全局状态中获取）
  const userInfo = ref({});

  useUserStore().getInfo().then(res => {
    userInfo.value = res;
  })

  const textComment = ref('');
  const fraction = ref(3);
  const allComments = ref([]); // 保存所有已加载的评论
  const loading = ref(false);
  const page = ref(1);
  const pageSize = ref(5);
  const total = ref(0);
  
// 获取评论列表函数，避免与 API 方法重名，采用 fetchComments 命名
const fetchComments = async (curPage, curPageSize) => {
  try {
    if (!props.isPreview) { 
      const response = await selectComments({
        artworkId: props.artworkId,
        page: curPage,
        pageSize: curPageSize
      });
      console.log(response.data);
      const { total: pages, list } = response.data;
      total.value = pages;
      // 合并加载的评论
      allComments.value.push(...list);
    }
  } catch (error) {
    ElMessage({
      message: '加载评论失败，请稍后重试',
      type: 'error',
      plain: true,
    });
  }
};
  
  // 初始化加载第一页评论
  fetchComments(page.value, pageSize.value);
  
  const loadMoreComments = async () => {
        if (!props.isPreview) {
            loading.value = true;
            page.value += 1;
            await fetchComments(page.value, pageSize.value);
            loading.value = false;
        }
};
  
  const userDetail = (userId) => {
    router.push(`/personal/${userId}`);
  };
  
  const submitComment = async () => {
    if (props.isPreview) return;
    if (textComment.value.trim() === '') {
      ElMessage({
        message: '请输入评论内容',
        type: 'error',
        plain: true,
      });
      return;
    }
    if (!userInfo) {
      router.push('/personal');
      return;
    }
    // 构造评论数据：注意字段名称与后端保持一致
    const commentData = {
      artworkId: props.artworkId,
      userId: userInfo.value.userId,
      rating: fraction.value,
      reviewContent: textComment.value,
    };
   
      // 调用接口提交评论
      await sendComment(commentData);
      // 提交成功后重置输入
      textComment.value = '';
      fraction.value = 3;
      ElMessage({
        message: '评论发布成功',
        type: 'success',
        plain: true,
      });
      // 构造新评论对象（前端临时数据，后端返回的数据可用于更新评论ID等信息）
      const newComment = {
        ...commentData,
        reviewTime: new Date().toISOString(),
        nickname: userInfo.value.nickname,
        role: userInfo.value.role,
        avatarUrl: userInfo.value.avatar,
        reviewId: Date.now(), // 使用时间戳作为临时 ID，后续可使用真实返回值
      };
      // 将新评论添加到列表顶部
      allComments.value.unshift(newComment);

  };
</script>
  
  <style>
  .comment-container {
    margin-top: 18px;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
  }
  </style>
  