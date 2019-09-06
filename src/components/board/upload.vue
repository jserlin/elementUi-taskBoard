<template>
  <el-dialog
    title="添加附件"
    :visible.sync="dialogVisible"
    width="50%"
  >
    <div class="upload-wrap">
      <el-upload
        ref="upload"
        class="upload-content"
        :auto-upload="false"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :on-success="uploadSuccess"
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em></div>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitUpload">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  watch: {
    show(nv) {
      // if (!nv) {
      //   this.$refs.upload.clearFiles()
      // }
      this.dialogVisible = nv
    },
    dialogVisible(nv) {
      this.$emit('update:visible', nv)
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
      // this.dialogVisible = false/
    },
    uploadSuccess(response, file, fileList) {
      this.$emit('update:fileList', fileList)
      console.log('TCL: uploadSuccess -> fileList', fileList)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss">
  .upload-content {
    text-align: center;
  }
</style>
