<template>
    <HeaderBar />
    <div class="upload-container">
        <span style="font-size: 25px;font-weight: bold;">请发布您的数字艺术作品</span>
        <el-divider />
        <div style="margin: 5px;">
            <el-form 
                ref="formElRef"
                label-position="top"
                :model="artForm"
                :rules="rules"
                :inline="true"
                status-icon
            >
            <el-form-item prop="name" class="art-title">
                <el-input 
                v-model="artForm.name"
                 maxlength="20"
                 show-word-limit 
                 placeholder="请输入艺术品名称"
                 clearable/>
            </el-form-item>

            <CategorySelector
                :categoryId="2" 
                @update:category="updateCategory"
                class="category-selector"
             />

             <el-form-item  prop="description" style="width: 100%;">
                <el-input 
                v-model="artForm.description"
                maxlength="50"
                show-word-limit 
                placeholder="请输入艺术品简介"
                clearable/>
            </el-form-item>

            <span style="font-size: 15px; margin-top: 10px;margin-bottom: 5px;">艺术品详情</span>
            <editor class="el-top" v-model="artForm.introduction" ></editor>

            <TagSelector class="tag-selector" ref="TagsComponent" @update:tags="updateTags"/>

                        <!-- 封面上传 -->
            <el-form-item style="width: 100%;" label="封面图上传" prop="mainImage">
                <UploadImage 
                v-model="artForm.mainImage"
                :limit="1"
                />
            </el-form-item>


            <el-form-item style="width: 100%;" label="更多图集上传" prop="promoImages">
                <UploadImage 
                v-model="artForm.promoImages" 
                :limit="4" 
                />
            </el-form-item>
            
            <el-form-item style="width: 100%;" label="数字艺术压缩包上传" prop="artworkFile">
                <FileUpload 
                v-model="artForm.artworkFile" 
                :limit="1" 
                :fileSize = "50"
                />
            </el-form-item>

            <el-form-item label="价格">
              <el-input-number v-model="artForm.price" :min=15 :max=100000 :precision=2 style="width: 300px;">
                <template #prefix>
                  <span>￥</span>
                </template>
              </el-input-number>
            </el-form-item>

            <el-divider />
            <el-form-item>
              <div style="display: flex;justify-content: space-between; width: 100%;">
                <div>
                  <el-button type="primary" @click="submitForm" style="width: 100px;">保存</el-button>
                  <el-button @click="resetForm">重置</el-button>
                  <el-button style="width: 100px;" @click="viewFrom">预览</el-button>
                </div>
              </div>
            </el-form-item>

        </el-form>
        </div>
    </div>
</template>
<script setup>
import HeaderBar from '@/components/Pages/mune/header.vue';
import UploadImage from '@/components/ImageUpload/index.vue';
import FileUpload from '@/components/FileUpload/index.vue';



const artForm = reactive({
  artworkId: '',
  name: '',// 艺术品名称
  description: '',// 艺术品简介
  introduction: '',// 艺术品描述
  price: 15, //价格
  category:{},
  dynamicTags: [], // 标签
  artworkFile: '',
  mainImage: '',// 首图
  promoImages: '',// 宣传图
});
//重置表单
const resetForm = () => {
  formElRef.value.resetFields(); // ✅ 重置表单字段
  TagsComponent.value.clearTags(); // ✅ 调用子组件的方法清空标签
  // ✅ 确保 `artForm` 也被正确重置
  artForm.artworkId = '';
  artForm.name = '';
  artForm.description = '';
  artForm.introduction = '';
  artForm.price = 15;
  artForm.category = {};
  artForm.dynamicTags = []; // ✅ 直接清空标签
  artForm.mainImage = '';
  artForm.promoImages = '';
  artForm.artworkFile = '';

  ElMessage.success('重置成功');
  updateShape(); // ✅ 更新立方体尺寸
};

// 自定义验证函数：检查 category.id 是否存在
const checkCategory = (rule, value, callback) => {
  if (artForm.category.subcategoryId === undefined) {
    ElMessage.error('请选择分类');
  } else {
    callback();
  }
};

const rules = reactive({
  name: [{ required: true, message: '请输入艺术品名称', trigger: 'blur' }],
  description: [{ required: true, message: '请输入艺术品简介', trigger: 'blur' }],
  dynamicTags: [{ required: true, message: '请至少选择一个标签', trigger: 'blur' }],
  mainImage: [{ required: true, message: '请上传封面图', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'blur', validator: checkCategory }],
  promoImages: [{ required: true, message: '请上传至少一张图集', trigger: 'blur' }],
  artworkFile: [{ required: true, message: '请上传数字艺术品压缩包', trigger: 'blur' }],
});

// 更新标签
const updateTags = (dynamicTags) => {
  artForm.dynamicTags = dynamicTags;
};

const submitForm = async () => {
    await formElRef.value.validate(async (valid) => {
        
    })
}

</script>


<style scoped lang="scss">
.tag-selector{
  width: 100%;
}
.art-size{
    width: 100%;
}
.art-title{
    width: 61.5%;
}
.category-selector{
    width: 30%;
}
.el-top{
    margin-bottom: 10px;
    width: 96%;
}
.upload-container{
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}
.cube-container{
  width: 100%;
  height: 300px;
  margin-top: 20px;
}
</style>