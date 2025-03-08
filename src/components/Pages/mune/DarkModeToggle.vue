

<template>
    <div class="btn theme-btn" @click="toggleTheme" >
        <i class="iconfont-sys">
            {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
        </i>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSettingStore } from '@/store/modules/setting';
import { useTheme } from '@/composables/useTheme.js';
import { SystemThemeEnum } from '@/enums/appEnum';

const store = useSettingStore();
const isDark = computed(() => store.isDark);

const toggleTheme = () => {
  let { LIGHT, DARK } = SystemThemeEnum;
  useTheme().setSystemTheme(store.systemThemeType === LIGHT ? DARK : LIGHT);
};

// 🔥 让 `toggleTheme` 方法可以被父组件访问
defineExpose({
  toggleTheme
});
</script>

<style lang="scss" scoped>
.btn {
        display: inline-block;
        padding: 5px;
        margin-left: 15px;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;

        i {
          font-size: 18px;
        }

        &:hover {
          color: var(--main-color) !important;
        }
      }
</style>