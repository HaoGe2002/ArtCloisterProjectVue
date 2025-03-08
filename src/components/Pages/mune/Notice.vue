<template>
  <div class="inbox-menu" @click="toggleMenu" v-if="!list">
    <!-- 消息中心图标，带未读徽章 -->
    <el-badge :value="unreadCount" class="item" v-if="unreadCount > 0">
      <el-icon class="icon" size="24"><Bell /></el-icon>
    </el-badge>
    <el-icon v-else class="icon" size="24"><Bell /></el-icon>

    <!-- 下拉菜单 -->
    <transition name="fade">
      <div v-show="isMenuOpen && !isMobile" class="dropdown-menu" @click.stop>
        <!-- Tabs 导航 -->
        <div class="tabs">
          <div class="all-tabs">
            <span v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: activeTab === index }" @click="activeTab = index">
              {{ tab }}
            </span>
          </div>
        </div>

        <!-- 收件箱内容 -->
        <div class="content" v-if="activeTab === 0">
          <div v-if="messages.length === 0" class="empty-state">
            <el-icon class="empty-icon"><Folder /></el-icon>
            <p>没有新的通知</p>
          </div>
          <div v-else class="message-item" v-for="(msg, i) in messages" :key="msg.notificationId" @click="openMessage(msg)">
            <div class="message-header">
              <span class="message-title">{{ msg.title || '通知' }}</span>
              <span class="message-time">{{ formatDate(msg.createdAt) }}</span>
            </div>
            <p class="message-content">{{ msg.content }}</p>
            <el-icon v-if="!msg.isRead" class="unread-icon"><InfoFilled /></el-icon>
          </div>
        </div>
      </div>
    </transition>
  </div>

  <el-dialog v-model="messageDialogVisible" title="通知详情" width="500px">
  <p><strong>标题：</strong> {{ selectedMessage?.title || '通知' }}</p>
  <p><strong>时间：</strong> {{ formatDate(selectedMessage?.createdAt) }}</p>
  <p><strong>内容：</strong> {{ selectedMessage?.content }}</p>
  <template #footer>
    <el-button @click="messageDialogVisible = false">关闭</el-button>
  </template>
</el-dialog>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { Bell, Folder, InfoFilled } from "@element-plus/icons-vue";
import { getAllStatuses, markNotificationAsRead } from "@/api/notification/notifications";
import { ElMessage } from "element-plus";

const props = defineProps({
  isMobile: Boolean,
  list: Boolean
});

const isMenuOpen = ref(false);
const activeTab = ref(0);
const tabs = ref(["收件箱"]);
const messages = ref([]);
const unreadCount = ref(0);
const messageDialogVisible = ref(false);
const selectedMessage = ref(null);

const loadNotifications = () => {
  getAllStatuses().then(response => {
    messages.value = response.data;
    unreadCount.value = response.data.filter(notification => !notification.isRead).length;
  }).catch(() => {
    ElMessage.error("获取通知失败");
  });
};

const openMessage = (message) => {
  selectedMessage.value = message;
  messageDialogVisible.value = true;
  if (!message.isRead) {
    
    markNotificationAsRead(selectedMessage.value.notificationId).then(() => {
      messages.value = messages.value.map(msg => msg.notificationId === message.notificationId ? { ...msg, isRead: true } : msg);
      unreadCount.value = messages.value.filter(msg => !msg.isRead).length;
    });
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

onMounted(() => {
  loadNotifications();
  // document.addEventListener("click", handleClickOutside);
});

// onUnmounted(() => {
//   document.removeEventListener("click", handleClickOutside);
// });

const handleClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest(".inbox-menu")) {
    isMenuOpen.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<style scoped lang="scss">
.inbox-menu {
  position: relative;
  cursor: pointer;

  .icon {
    color: var(--el-text-color-primary);
  }
}

.dropdown-menu {
  position: absolute;
  top: 45px;
  right: 0;
  width: 360px;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  border: 1px solid var(--el-border-color-light);
  padding: 12px;
  z-index: 1000;
  transition: all 0.3s ease-in-out;
}

/* 🔹 Tabs 样式 */
.tabs {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid var(--el-border-color-light);
  padding-bottom: 5px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &.active {
    font-weight: bold;
    color: var(--el-color-primary);
    border-bottom: 2px solid var(--el-color-primary);
  }

  &:hover {
    color: var(--el-color-primary-light-3);
  }
}

/* 🔹 消息列表样式 */
.content {
  padding: 10px;
  max-height: 250px;
  overflow-y: auto;
  margin-top: 20px;
}

.message-item {
  padding: 10px;
  border-radius: 6px;
  background: var(--el-fill-color-blank);
  box-shadow: var(--el-box-shadow-light);
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.3s ease-in-out, transform 0.1s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    background: var(--el-color-primary-light-9);
    transform: scale(1.02);
  }
}

/* 🔹 消息头部 */
.message-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.message-title {
  color: var(--el-text-color-primary);
  font-size: 14px;
}

.message-time {
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

/* 🔹 消息内容 */
.message-content {
  color: var(--el-text-color-regular);
  font-size: 13px;
  line-height: 1.4;
}

/* 🔹 未读消息标记 */
.unread-icon {
  color: var(--el-color-danger);
  font-size: 12px;
}

/* 🔹 空状态样式 */
.empty-state {
  text-align: center;
  padding: 20px;
  color: var(--el-text-color-secondary);

  .empty-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
}

/* 🔹 响应式支持 */
@media (max-width: 480px) {
  .dropdown-menu {
    width: 90%;
    right: 5%;
  }

  .tab-item {
    font-size: 12px;
    padding: 6px;
  }

  .message-item {
    padding: 8px;
  }

  .message-title {
    font-size: 12px;
  }

  .message-time {
    font-size: 10px;
  }
}

</style>
