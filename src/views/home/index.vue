<template>
    <HeaderBar />
    <banner :slides="artslides" @banner-click="handleBannerClick"/>
    <types :slides="typeslides" @types-click="handletypeClick"/>
    <DigitArtList :subcategoryId="subcategoryId"/>
    <physicalArtList v-if="categoryId==1" :categoryId="1" />
</template>

<script setup>
    import banner from '@/components/Pages/home/banner/banner.vue'
    import types from '@/components/Pages/home/types/types.vue';
    import HeaderBar from '@/components/Pages/mune/header.vue';
    import DigitArtList from '@/components/Pages/artlist/digitArtList.vue';
    import physicalArtList from '@/components/Pages/artlist/physicalArtList.vue';
    import { useSettingStore } from '@/store/modules/setting'

    const store = useSettingStore();
    
    const subcategoryId = ref(null) 
    const setSwitchType = ref({})
    const typeslides = ref([]);

    const categoryId = ref(null)

    const switchType = ()=> {
    store.getSubcategories().then(() => {
        typeslides.value = store.SubCategories
        // categoryId.value = tab
      }).catch(err => {
        console.log(err)
      })
    }

    onMounted(() => {
      switchType()
    })

    const artslides = [
  {
    id: '001',
    image: "https://picsum.photos/id/1020/800/300",
    badge: '白羊座',
    title: '全新画作绝对上市',
    description: '艺术家马克的力倾之作',
  }
    ];


    const handletypeClick = (id) => {
      subcategoryId.value = id
      // 在这里添加你想要执行的逻辑
    };
    const handleBannerClick = (id) => {
      console.log('Banner clicked with id:', id);
      // 在这里添加你想要执行的逻辑
    };

</script>

<style lang="scss" scoped>

</style>