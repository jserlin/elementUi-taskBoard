<template>
  <div
    class="editAbleDiv"
    contenteditable
    @input="setContent"
    @blur="update"
    v-html="html"
  >
    <!-- <div class="edit-content" >111</div> -->
  </div>
</template>
<script>
export default {
  props: {
    html: {
      type: String,
      default: ''
    }
  },
  methods: {
    setContent($event) {
      console.log('TCL: setContent -> $event', $event)
      this._contenHtml = $event.target.innerHTML
    },
    update() {
      if (this._contenHtml === undefined) return
      console.log('光标消失')
      this.$emit('update', this._contenHtml)
    },
    keepLastIndex(domObj) {
      if (window.getSelection) { // ie11 10 9 ff safari
        domObj.focus() // 解决ff不获取焦点无法定位问题
        const range = window.getSelection()// 创建range
        range.selectAllChildren(domObj)// range 选择obj下所有子内容
        range.collapseToEnd()// 光标移至最后
      } else if (document.selection) { // ie10 9 8 7 6 5
        const range = document.selection.createRange()// 创建选择对象
        // var range = document.body.createTextRange();
        range.moveToElementText(domObj)// range定位到obj
        range.collapse(false)// 光标移至最后
        range.select()
      }
    }
  }
}
</script>
