<template>
  <el-form-item prop="category">
    <el-select
      v-model="selectedValueId"
      placeholder="请选择分类"
      @change="handleChange"
    >
      <el-option
        v-for="item in options"
        :key="item.subcategoryId"
        :label="item.subcategoryName"
        :value="item.subcategoryId"
      />
    </el-select>
  </el-form-item>
</template>

<script setup>
import { getSubCategories } from '@/api/type/type';

// 让 `category` 作为 `v-model` 绑定的值
const props = defineProps({
  modelValue: Object // `v-model` 绑定的是对象
});

// 触发 `update:modelValue` 以同步数据到父组件
const emit = defineEmits(['update:modelValue']);

const options = ref([]); // 分类选项
const selectedValueId = ref(props.modelValue?.subcategoryId || null); // 只存 ID

// 监听 `selectedValueId` 变化，找到完整对象并更新 `v-model`
const handleChange = (subcategoryId) => {
  const selectedObj = options.value.find(item => item.subcategoryId === subcategoryId);
  if (selectedObj) {
    emit('update:modelValue', selectedObj); // ✅ 传完整对象给 `v-model`
  }
};

// 获取分类数据
const fetchCategories = async () => {
  try {
    const res = await getSubCategories();
    options.value = res.data;

    // 如果 `modelValue` 里有 ID，找到完整对象
    if (props.modelValue?.subcategoryId) {
      handleChange(props.modelValue.subcategoryId);
    }
  } catch (error) {
    console.error("获取分类数据失败:", error);
  }
};

// 初始化分类数据
fetchCategories();

// 监听 `props.modelValue` 变化，确保 `selectedValueId` 同步更新
watch(() => props.modelValue, (newValue) => {
  selectedValueId.value = newValue?.subcategoryId || null;
});
</script>
