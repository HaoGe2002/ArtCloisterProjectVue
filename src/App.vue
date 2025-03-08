

<template>
  <router-view />
</template>

<script setup>
import {initState, saveUserData} from './utils/storage'
import {onMounted} from 'vue'
onMounted(() => {
  console.log('App.vue')
  initState()
  saveUserData()
})
</script>

<style scoped>
</style>
