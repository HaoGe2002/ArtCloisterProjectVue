<template>
    <HeaderBar v-if="!(adminArtworkId || addArtwork)" />
    <div class="upload-container">
        <span v-if="!(adminArtworkId || addArtwork)" style="font-size: 25px;font-weight: bold;">请发布您的实体艺术作品</span>
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
                v-model="artForm.category"
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

            <el-form-item label="尺寸" prop="size"  class="art-size">
                <div style="display: flex;justify-content: center; width: 100%;">
                <!-- 高度 (Height) -->
                <el-input-number
                v-model="artForm.height"
                class="mx-4"
                :min="0.1"
                :max="500"
                :precision=2
                controls-position="right"
                @change="updateShape"
                >
                <template #prefix>
                    <span>H</span>
                </template>
                <template #suffix>
                    <span>cm</span>
                </template>
                </el-input-number>

                <div style="margin: 0 20px;">
                <el-icon><Close /></el-icon>
                </div>

                <!-- 宽度 (Width) -->
                <el-input-number
                v-model="artForm.width"
                class="mx-4"
                :min="0.1"
                :max="500"
                :precision=2
                controls-position="right"
                @change="updateShape"
                >
                <template #prefix>
                    <span>W</span>
                </template>
                <template #suffix>
                    <span>cm</span>
                </template>
                </el-input-number>

                <div v-if="is3D" style="margin: 0 20px;">
                    <el-icon ><Close /></el-icon>
                </div>

                <!-- 深度 (length) -->
                <el-input-number
                    v-if="is3D"
                    v-model="artForm.length"
                    class="mx-4"
                    :min="0.1"
                    :max="500"
                    :precision=2
                    controls-position="right"
                    @change="updateShape"
                >

                <template #prefix>
                    <span>D</span>
                </template>
                <template #suffix>
                    <span>cm</span>
                </template>
                </el-input-number>
                </div>
                <div ref="cubeContainer" class="cube-container"></div>
            </el-form-item>

            <TagSelector class="tag-selector" v-model="artForm.dynamicTags" ref="TagsComponent" />

            <!-- 封面上传 -->
            <el-form-item style="width: 100%;" label="封面图上传" prop="mainImage">
                <UploadImage 
                v-model="artForm.mainImage"
                :limit="1"
                />
            </el-form-item>

            <el-form-item style="width: 100%;" label="细节图上传" prop="promoImages">
                <UploadImage 
                v-model="artForm.promoImages" 
                :limit="4" 
                />
            </el-form-item>
            
            <el-form-item v-if="false" style="width: 100%;" label="数字艺术压缩包上传" prop="artworkFile">
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

            <el-form-item v-if="adminArtworkId || addArtwork" label="状态">
              <el-select v-model="artForm.status" placeholder="请选择状态" style="width: 300px;">
                <el-option label="未审核" :value="0" />
                <el-option label="审核中" :value="1" />
                <el-option label="审核通过" :value="2" />
                <el-option label="审核未通过" :value="3" />
                <el-option label="上架" :value="4" />
                <el-option label="售出" :value="5" />
                <el-option label="下架" :value="6" />
              </el-select>
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



        <el-dialog 
        v-model="dialogFormVisible" 
        fullscreen
        :before-close="handleDialogClose">
          <ArtDetail
            v-if="dialogFormVisible"
            :artworkData="artForm" 
            :isPreview="true" 
          />
        </el-dialog>

    </div>
</template>

<script setup>
import { reactive, ref,onMounted,nextTick, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import HeaderBar from '@/components/Pages/mune/header.vue';
import CategorySelector from '@/components/From/CategorySelector.vue';
import TagSelector from '@/components/From/TagSelector.vue';
import { initScene, updateCube } from '@/utils/threeCube';
import UploadImage from '@/components/ImageUpload/index.vue';
import { saveArtwork,selectSaveArtwork } from '@/api/artwork/artwork'
import { useRouter,useRoute } from 'vue-router'
import {useUserStore} from '@/store/modules/userStore'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const formElRef = ref(null);
const cubeContainer = ref(null);
const emit = defineEmits(['close']); 

const props = defineProps({
  adminArtworkId: { type: Number, default: null },
  addArtwork: { type: Boolean, default: false }
})


const artForm = reactive({
  artworkId: '',
  name: '',// 艺术品名称
  description: '',// 艺术品简介
  introduction: '',// 艺术品描述
  price: 15, //价格
  category:{},
  status : 0,
  height: 100,  // 高度 (Height)
  width: 100,   // 宽度 (Width)
  length: 0,   // 深度 (length)
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
  artForm.height = 100;
  artForm.width = 100;
  artForm.length = 0;
  artForm.status = 0;
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
  promoImages: [{ required: true, message: '请上传至少一张宣传图', trigger: 'blur' }],
});

let seleArtworkId = ref(null);
// 是否为 3D 类型
const is3D = ref(false);
// 是否为数字作品

watch(() => artForm.dynamicTags, (newValue) => {
  console.log(newValue);
});


watch(() => artForm.category, (newValue, oldValue) => {
  is3D.value = newValue.is3d;
  resetShape();
});



// 重置立方体尺寸（根据分类类型）
const resetShape = () => {
  artForm.height = 100;
  artForm.width = 100;
  artForm.length = is3D.value ? 100 : 0; // 根据是否为 3D 类型设置深度
  updateShape();
};

const getUpdateArtwork = () => {

  if(!props.adminArtworkId){
    seleArtworkId.value = route.params.artworkId
  }else{
    seleArtworkId.value = props.adminArtworkId
  }
  if (seleArtworkId.value){
    selectSaveArtwork(seleArtworkId.value).then ((res) => {
        artForm.artworkId = res.data.artworkId;
        artForm.name = res.data.name;
        artForm.description = res.data.description;
        artForm.introduction = res.data.introduction;
        artForm.price = res.data.price;
        artForm.category = res.data.category;
        artForm.dynamicTags = res.data.dynamicTags;
        artForm.mainImage = res.data.mainImage;
        artForm.promoImages = res.data.promoImages;
        artForm.artworkFile = res.data.artworkFile;

        if ((props.adminArtworkId || props.addArtwork)) {
          artForm.status = res.data.status;
        }else{
          artForm.status = 0;
        }
    });
  }
}

onMounted(async () => {
  await nextTick(); // 确保 DOM 已经完全渲染
  if (cubeContainer.value) {
    initScene(cubeContainer.value, artForm); // 初始化 Three.js 场景
  }
  getUpdateArtwork();
});

const updateShape = () => {
  updateCube(artForm);
};

const TagsComponent = ref(null);  // 获取子组件的 ref
const componentKey = ref(0); // 初始化组件 key
const dialogFormVisible = ref(false);

const userId = ref(null);
const submitForm = async () => {
  await formElRef.value.validate(async (valid) => {
    saveArtwork(artForm).then(res=>{
      ElMessage.success('保存成功');
      artForm.artworkId = res.artworkId;
      userId.value = userStore.getUserId
      if(!(props.adminArtworkId || props.addArtwork)){
        router.push(`/personal/${userId.value}?tab=editing`)
      }else{
        emit('close')
      }
    })

  });
};

const viewFrom = async() => {
  await formElRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    dialogFormVisible.value = true;
  });
}

const handleDialogClose = () => {
  dialogFormVisible.value = false; // 关闭预览对话框
};


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