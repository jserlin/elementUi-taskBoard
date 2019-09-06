<template>
  <div v-loading="isLoading" class="container">
    <el-row class="mt10" type="flex" justify="end">
      <!-- <el-button type="primary" :loading="isLoading" @click="updateWorkItem">保存</el-button> -->
      <el-button type="primary" @click="updateWorkItem">保存</el-button>
    </el-row>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="steps" name="4">
        <div v-if="boardDetail.systemInfo" class="bt">
          <step ref="testCaseStep" :steps-json-str="boardDetail.steps || ''" @update:steps="setBoardDetail('steps', $event)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="systemInfo" name="1">
        <div v-if="boardDetail.systemInfo" class="bt">
          <editor tips="添加系统信息" :pre-html="boardDetail.systemInfo" @updateEditorHtml="setBoardDetail('systemInfo', $event)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="Description" name="2">
        <div v-if="boardDetail.itemDesc" class="bt">
          <editor tips="添加描述信息" :pre-html="boardDetail.itemDesc" @updateEditorHtml="setBoardDetail('itemDesc', $event)" />
        </div>
      </el-collapse-item>
      <el-collapse-item title="discussion" name="3">
        <div class="bt">
          <comment ref="commentEditor" :comment-json-str="boardDetail.comment" @addComment="addComment" @updateCommentJsonStr="updateCommentJsonStr" />
        </div>
      </el-collapse-item>
    </el-collapse>

    <!-- <el-upload
      class="upload-demo"
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload> -->
  </div>
</template>

<script>
import { getWorkItemById, updateWorkItem } from '@/api/task'

import editor from '@/components/board/editor'
import step from '@/components/board/step'
import comment from '@/components/board/comment'
import { setTimeout } from 'timers'

export default {
  components: {
    editor,
    step,
    comment
  },
  data() {
    return {
      // activeNames: ['1', '2', '3'],
      activeNames: ['4'],
      contentHtml: '<p class="user-display-name">用户</p>',
      boardDetail: {},
      isLoading: false
    }
  },
  computed: {
    noChange() {
      return true
    }
  },
  mounted() {
    this._getWorkItemById(this.$route.query.id)
  },
  methods: {
    updateWorkItem() {
      this.isLoading = true
      delete this.boardDetail.createTime
      delete this.boardDetail.updateTime
      // delete this.boardDetail.comment
      // 等详情数据接收完毕
      this.$refs.testCaseStep.updateStpsData()
      setTimeout(() => {
        this.boardDetail.comment = this._commentJsonStr
        this.$refs.commentEditor.initEditor()
        updateWorkItem(this.boardDetail).then(res => {
          this.isLoading = false
        })
      }, 50)
    },
    setBoardDetail(key, $event) {
      this.boardDetail[key] = $event
    },
    addComment(commentJsonStr) {
      this._commentJsonStr = commentJsonStr
    },
    updateCommentJsonStr(commentJsonStr) {
      this._commentJsonStr = commentJsonStr
      this.updateWorkItem()
    },
    _getWorkItemById(id) {
      getWorkItemById({ id }).then(res => {
        console.log('TCL: _getWorkItemById -> res', res)
        res.comment = res.comment || ''
        this.boardDetail = res
      })
    },
    handleChange(val) {
      console.log(val)
    },
    saveComment() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    margin: 30px;
    .bt {
      padding-top: 5px;
      border-top: 1px solid rgba(234,234,234,1);
    }
  }
</style>
<style lang="scss">
.container{
  .w-e-text {
    overflow-y: auto;
  }
}
.item__wrap {
  &:hover{
    overflow: auto;
  }
}
</style>
<style lang="scss">
  .container {
    .el-collapse-item__wrap {
      overflow: inherit;
    }
    .w-e-menu {
      z-index: 98 !important
    }
    .el-collapse-item__wrap {
      border-bottom: 1px solid transparent
    }
  }
</style>
