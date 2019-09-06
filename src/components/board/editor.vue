<template>
  <div class="editor-wrap" :class="{blue: isFocus}" :style="{borderRadius: radius+'px'}">
    <p v-if="!editorContent&&!isFocus&&!preHtml" class="tips-text">{{ tips }}</p>
    <div ref="editor" class="editor editor-content">
      <!-- <div v-html="preHtml" /> -->
    </div>
    <div v-show="isFocus" ref="toolbar" class="toolbar" style="text-align:left" />
    <!-- <div class="" @click="">
      <div v-html="editorContent" />
    </div> -->
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'Editor',
  props: {
    tips: {
      type: String,
      default: '添加信息'
    },
    radius: {
      type: String,
      default: '0'
    },
    preHtml: {
      type: String,
      default: ''
    },
    needFocus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editorContent: '',
      isFocus: false
    }
  },
  mounted() {
    const editor = new E(this.$refs.toolbar, this.$refs.editor)
    this.editor = editor
    editor.customConfig.onchange = (html) => {
      this.editorContent = html
      this.$emit('updateEditorHtml', this.editorContent)
    }
    editor.customConfig.onfocus = () => {
      editor.$textElem.attr('contenteditable', true)
      if (!this.editorContent) {
        // 清除再赋值为了获取光标
        editor.txt.clear()
        if (this.preHtml) {
          editor.txt.html(`<p>${this.preHtml}</div>`)
        }
      }
      this.isFocus = true
    }
    editor.customConfig.onblur = () => {
      if (this.editorContent === '<p><br></p>') {
        // this.$emit('updateEditorHtml', this.editorContent)
        this.editorContent = ''
      }
      // this.$emit('updateEditorHtml', this.editorContent)
      this.isFocus = false
    }
    editor.customConfig.uploadImgShowBase64 = true
    editor.customConfig.zIndex = 100
    // editor.customConfig.pasteIgnoreImg = false
    // 自定义菜单配置
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      // 'table',  // 表格
      // 'video',  // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
    if (!this.needFocus) {
      editor.$textElem.attr('contenteditable', false)
    } else {
      this.isFocus = true
    }
    if (this.preHtml) {
      const htmlStr = this.preHtml.indexOf('<p>') !== -1 ? this.preHtml : `<p>${this.preHtml}</div>`
      editor.txt.html(htmlStr)
    }
  },
  methods: {
    initEditor() {
      this.editor.txt.clear()
      this.isFocus = false
      this.editorContent = ''
      this.editor.$textElem.attr('contenteditable', false)
    },
    getContent: function() {
      alert(this.editorContent)
    }
  }
}
</script>

<style lang="scss" scoped>
  .editor-wrap{
    position: relative;
    padding: 3px;
    box-sizing: border-box;
    border: 1px solid transparent;
    &:hover{
      border: 1px solid #eee;
    }
    .tips-text{
      position: absolute;
      left: 1em;
      top: 0;
      // position: relative;
      // margin-bottom: 30px;
      font-style: italic;
      color: rgba(0,0,0,.55);
    }
    .editor{
      min-height: 70px;
      text-align: left
    }
  }
  .blue {
    border: 1px solid rgba(43,136,216,1);
    &:hover{
      border: 1px solid rgba(43,136,216,1);
    }
  }
</style>
<style lang="scss">
.w-e-droplist {
  z-index: 10001;
}
</style>
