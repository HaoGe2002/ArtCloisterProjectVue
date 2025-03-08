import autoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'; // 导入 ElementPlusResolver
export default function createAutoImport() {
    return autoImport({
        imports: [
            'vue',
            'vue-router',
            'pinia'
            
        ],
        resolvers: [ElementPlusResolver()],
        dts: false
    })
}
