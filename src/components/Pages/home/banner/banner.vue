<template>
    <div class="Home-Banner">
      <swiper 
        :slides-per-view="slidesPerView"
        :space-between="10"
        :navigation="true"
        :pagination="true"
        :loop="true"
        :autoplay="{ delay: 500 }"
        :modules="[Navigation]" 
      >
        <swiper-slide @click="handleClick(slide.id)" v-for="slide in slides" :key="slide.id">
          <div class="slide-content" :style="{ backgroundImage: `url(${slide.image})` }">
            <div class="slide-overlay">
              <span class="badge">{{ slide.badge }}</span>
            </div>
            <div class="slide-text">
              <span>{{ slide.title }}</span>
              <p>{{ slide.description }}</p>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
</template>

<script setup>
  import { Swiper, SwiperSlide } from "swiper/vue";
  import { Navigation, Pagination } from "swiper";
  import "swiper/css";
  import "swiper/css/navigation";
  import "swiper/css/pagination";

  const props = defineProps({
  slides: {
    type: Array,
    required: true
  }
  });

  
  const emit = defineEmits(['banner-click']);

  const handleClick = (id) => {
    emit('banner-click', id);
  };
  const { width } = useWindowSize()

  const slidesPerView = computed(() => {
    if (width.value < 768) {
      return 1;
    } else if (width.value < 1024) {
      return 2;
    } else {
      return 3;
    }
  });
</script>

<style lang="scss" scoped>
@use './index.scss'
</style>