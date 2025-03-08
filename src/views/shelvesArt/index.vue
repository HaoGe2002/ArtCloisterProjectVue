<template>
  <HeaderBar :noPlaceholder = "true"/>
    <div class="selection-container">
      <span>请选择您要发布的艺术品类型</span>
  
      <div class="options">
        <!-- 创建实体艺术品按钮 -->
        <div 
          class="option" 
          @mouseenter="showImage('left')" 
          @mouseleave="hideImage"
          @click="goToPhysical"
        >
          <img src="../../assets/img/artType/PhysicalArt.webp" alt="实体艺术品" />
          <h2>实体艺术品</h2>
          <p>创建可触摸的艺术品，如油画、雕塑。</p>
        </div>
  
        <!-- 创建线上艺术品按钮 -->
        <div 
          class="option" 
          @mouseenter="showImage('right')" 
          @mouseleave="hideImage"
          @click="goToVirtual"
        >
          <img src="../../assets/img/artType/VirtualArt.webp" alt="线上艺术品" />
          <h2>线上艺术品</h2>
          <p>创建只存在于数字世界中的艺术品。</p>
        </div>
      </div>
  
      <!-- 左边隐藏的大图 -->
      <img 
        ref="leftImage" 
        src="../../assets/img/login/BPhysicalArt.png" 
        class="hover-image slide-left" 
      />
  
      <!-- 右边隐藏的大图 -->
      <img 
        ref="rightImage" 
        src="../../assets/img/artType/BVirtualArt.png"
        class="hover-image slide-right" 
      />
    </div>
  </template>
  
  
  
  <script setup>
  // import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import HeaderBar from '@/components/Pages/mune/header.vue';
  
  const router = useRouter();
  const leftImage = ref(null); // 引用左侧大图
  const rightImage = ref(null); // 引用右侧大图
  
  const goToPhysical = () => router.push('/physical');
  const goToVirtual = () => router.push('/virtual');
  
  // 显示大图
  const showImage = (direction) => {
    if (direction === 'left') {
      leftImage.value.style.transform = 'translateX(60%)';
    } else {
      rightImage.value.style.transform = 'translateX(-60%)';
    }
  };
  
  // 隐藏大图
  const hideImage = () => {
    leftImage.value.style.transform = 'translateX(-20%)';
    rightImage.value.style.transform = 'translateX(20%)';
  };
  
  // 确保大图在组件挂载时默认隐藏
  onMounted(() => {
    hideImage();
  });
  </script>

  
<style scoped lang="scss">
.selection-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  position: relative;
  overflow: hidden;

  span {
    margin-bottom: 30px;
    font-size: 32px;
    font-weight: bold;
  }

  .options {
    display: flex;
    gap: 50px;
    position: relative;
    z-index: 2;
  }

  .option {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 240px;
    height: 320px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;

    img {
      width: 150px;
      height: 150px;
      margin-bottom: 15px;
      border-radius: 50%;
      transition: transform 0.3s;
    }

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);

      img {
        transform: translateY(-30px) scale(1.5);
      }
    }
  }

  .hover-image {
    position: absolute;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s;
    z-index: 1;
    transform: translateY(-50%); /* 垂直居中 */
  }

  .slide-left {
    left: -30%; /* 默认隐藏在左侧 */
  }

  .slide-right {
    right: -30%; /* 默认隐藏在右侧 */
  }
}
</style>

