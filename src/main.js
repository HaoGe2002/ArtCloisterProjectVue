import { createApp } from 'vue'
import App from './App.vue'
import router from './router';        // 导入路由

import 'element-plus/dist/index.css'; // 引入 Element Plus 样式
import 'element-plus/theme-chalk/dark/css-vars.css' // Element 暗黑主题
import 'normalize.css'; // 引入 Normalize CSS

import '@icons/system/iconfont.js'                  // 系统彩色图标
import '@icons/system/iconfont.css'                 // 系统图标
import plugins from './plugins' // plugins
import './permission' // permission control

import '@styles/reset.scss'                         // 重置HTML样式
import '@styles/app.scss'                           // 全局样式
import '@styles/pages.scss'                         // 公共页面样式
import '@styles/el-ui.scss'                         // 优化element样式
import '@styles/mobile.scss'                        // 移动端样式优化
import '@styles/change.scss'                        // 主题切换过渡优化
import '@styles/element.scss'                       // Element 自定义主题
import '@styles/dark.scss'                          // 系统主题
import * as ElementPlus from 'element-plus';       // 导入 Element Plus
import store from './store' // 导入 Pinia

const app = createApp(App);

// 使用 Element Plus
app.use(ElementPlus);
app.use(plugins)
app.use(store); // 使用 Pinia
app.use(router); // 使用路由

app.mount('#app');
