<!-- 富文本编辑器 插件地址：https://www.wangeditor.com/ -->
<template>
  <div class="editor-wrapper">
    <!-- 工具栏 -->
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :mode="mode"
      :defaultConfig="toolbarConfig"
    />
    
    <!-- 编辑器 -->
    <Editor
      class="editor-content"
      v-model="modelValue"
      :mode="mode"
      :defaultConfig="editorConfig"
      @onCreated="onCreateEditor"
    />
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'
  import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
  import { ElMessage } from 'element-plus'
  import { IDomEditor } from '@wangeditor/editor'


  const modelValue = defineModel<string>({ required: true })
  
  // 编辑器实例
  const editorRef = shallowRef()
  let mode = ref('simple')

  const toolbarConfig = {
    excludeKeys: ['fontFamily','fullScreen', 'insertImage', 'insertVideo','uploadImage','insertTable','codeBlock','todo','blockquote','group-image'] //'group-video', 'fontSize', 'lineHeight'
  }
  
  const editorConfig = {
    placeholder: '请输入内容...',
  }

    // 获取工具栏
  // const getToolbar = (editor: IDomEditor) => {
  //   setTimeout(() => {
  //     const toolbar = DomEditor.getToolbar(editor)
  //     console.log(toolbar?.getConfig().toolbarKeys) // 当前菜单排序和分组
  //   }, 300)
  // }

  const onCreateEditor = (editor: IDomEditor) => {
    editorRef.value = editor // 记录 editor 实例
    // editorRef.value.setHtml('内容')
    // getToolbar(editor)

    editor.on('fullScreen', () => {
      console.log('fullScreen')
    })
  }

  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
  })
</script>

<style lang="scss">
/* 编辑器整体容器 */
.editor-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 350px; /* ✅ 设置固定高度，避免页面抖动 */
  border: 1px solid rgba(var(--art-gray-300-rgb), 0.8);
  overflow: hidden;
}

/* 工具栏 */
.editor-toolbar {
  border-bottom: 1px solid rgba(var(--art-gray-300-rgb), 0.8);
  // background-color: #f8f9fa; /* ✅ 设置淡灰色背景 */
}

/* 编辑器内容 */
.editor-content {
  flex-grow: 1;
  overflow-y: auto; /* ✅ 超出部分滚动 */
  padding: 5px;
  background-color: transparent; /* ✅ 移除背景色 */
}

/* 调整编辑器默认字体颜色 */
.w-e-text-container [data-slate-editor] {
  color: #8a8a8a; /* ✅ 设置深色字体 */
  font-size: 16px;
  line-height: 1.6;
}

/* 隐藏分割线 */
.w-e-bar-divider {
  display: none;
}

/* 去掉编辑器的默认背景 */
.w-e-text-container {
  background-color: transparent !important;
}
</style>
