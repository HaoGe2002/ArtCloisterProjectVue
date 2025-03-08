<template>
    <div ref="placeholder" :style="{ height: isFixed ? '60px' : '0px' }"></div>
    <div ref="banner" class="Home-Banner" :class="{ 'is-fixed': isFixed }">
      <swiper 
          :slides-per-view="slidesPerView"
          :modules="[Navigation]" 
          :space-between="10" 
          navigation 
          pagination>


          <swiper-slide @click="clickCategory(null)" key="all">
            <div class="slide-content">
              <el-icon :size="25" ><Expand /></el-icon>
              <!-- <div class="slide-overlay">
              
              </div> -->
              <div class="slide-text">
                <p>全部</p>
              </div>
            </div>
          </swiper-slide>
          <swiper-slide @click="clickCategory(slide.subcategoryId)" v-for="slide in slides" :key="slide.subcategoryId" >
              <div class="slide-content">
                  <div class="slide-overlay" :style="{ backgroundImage: `url(${getImageUrl(slide.imageUrl)})` }"> 
                  </div>
                  <div class="slide-text">
                      <p>{{ slide.subcategoryName }}</p>
                  </div>
              </div>
          </swiper-slide>

      </swiper>
      </div>

</template>

<script setup>
  import { ref, computed, watch } from "vue";
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Navigation, Pagination } from "swiper";
  import { Search,Expand } from '@element-plus/icons-vue';
  import { parseTime,getImageUrl } from '@/utils/utils';
  
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";
  
  const { width } = useWindowSize()

  const props = defineProps({
  slides: {
      type: Array,
      required: true
    }
  });

  
  const emit = defineEmits(['types-click']);

  const clickCategory = (id) => {
    emit('types-click', id);
  };

  const isFixed = ref(false);
  const banner = ref(null);
  const placeholder = ref(null);

  const handleScroll = () => {
    if (!banner.value) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    isFixed.value = scrollY >= 300; // 滚动超过 60px 吸顶
  };

  onMounted(() => {
    
    window.addEventListener("scroll", handleScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  const slidesPerView = computed(() => {
    if (width.value < 768) {
      return 3;
    } else if (width.value < 1024) {
      return 5;
    } else {
      return 7;
    }
  });
</script>


<style lang="scss" scoped>

@use './index.scss'
</style>