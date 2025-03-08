<template>
  <el-form-item label="标签" prop="dynamicTags">
    <!-- 已选中的标签展示 -->
    <el-tag
      v-for="tag in selectedTags"
      :key="tag"
      closable
      @close="handleClose(tag)"
      style="margin-right: 10px; margin-bottom: 5px; margin-top: 5px;"
    >
      {{ tag }}
    </el-tag>

    <el-divider style="margin: 5px 0 10px 0;" />

    <!-- 标签输入框 -->
    <div style="display: flex; width: 100%; align-items: center;">
      <el-autocomplete
        v-model="inputValue"
        :fetch-suggestions="querySearchAsync"
        placeholder="请添加标签"
        @keyup.enter="handleInputConfirm"
        style="margin-bottom: 5px;"
      />
      <el-button type="primary" @click="handleInputConfirm" style="margin-left: 10px; height: 32px;">添加</el-button>
    </div>

    <!-- 清除所有标签按钮 -->
    <el-button @click="clearTags" style="margin-top: 5px;">清除所有标签</el-button>
  </el-form-item>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { getArtworkTags } from '@/api/artwork/tags';

// 让 `tags` 作为 `v-model` 绑定的值
const props = defineProps({
  modelValue: Array // `v-model` 绑定的是标签数组
});

// 触发 `update:modelValue` 以同步数据到父组件
const emit = defineEmits(['update:modelValue']);

const inputValue = ref('');  // 输入框的值
const selectedTags = ref([]);  // 选中的标签

// **修正 watch()，确保 `selectedTags` 始终和 `modelValue` 同步**
watch(() => props.modelValue, (newValue) => {
  selectedTags.value = Array.isArray(newValue) ? [...newValue] : []; // ✅ 避免错误
}, { immediate: true, deep: true });


// 标签搜索功能
let searchTimeout = null;
const querySearchAsync = async (queryString, cb) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    getArtworkTags(1, 5, queryString).then(res => {
      const results = res.tagsList?.map(tag => ({ value: tag.name })) || [];
      cb(results);
    });
  }, 500);
};

// 确认输入标签
const handleInputConfirm = () => {
  if (inputValue.value.length > 12) {
    ElMessage.error('标签不能超过12个字符！');
    return;
  }
  if (inputValue.value && !selectedTags.value.includes(inputValue.value)) {
    selectedTags.value.push(inputValue.value);
    emit('update:modelValue', [...selectedTags.value]);  // ✅ 触发 `v-model`
  } else {
    ElMessage.error('标签已存在，请勿重复添加！');
  }
  inputValue.value = '';  // 清空输入框
};

// 删除单个标签
const handleClose = (tag) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag);
  emit('update:modelValue', [...selectedTags.value]); // ✅ 触发 `v-model`
};

// 清除所有标签
const clearTags = () => {
  selectedTags.value = [];
  emit('update:modelValue', []);  // ✅ 触发 `v-model`
};

// 暴露 `clearTags` 方法供父组件调用
defineExpose({
  clearTags
});
</script>
