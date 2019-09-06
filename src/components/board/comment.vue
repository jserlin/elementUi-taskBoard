<template>
  <div class="comment-wrap">
    <!-- 评论编辑框 -->
    <div class="comments-section">
      <div class="wit-comment-item">
        <div class="comment-item-left">
          <el-avatar size="small" class="cursor-hover-card" :src="circleUrl" />
        </div>
        <div class="comment-item-right">
          <editor ref="commentEditor" tips="添加评论" radius="5" @updateEditorHtml="addComment" />
        </div>
      </div>
    </div>
    <!-- 评论列表 -->
    <div class="comments-section">
      <div v-for="(comment, index) in commentList" :key="'comment-' + index" class="wit-comment-item">
        <!-- 头像 -->
        <div class="comment-item-left">
          <el-avatar size="small" class="cursor-hover-card" :src="circleUrl" />
        </div>
        <div class="comment-item-right">
          <!-- 右侧 -->
          <div v-if="!comment.isEdit" class="wit-comment-viewer">
            <div class="comment-header">
              <div class="comment-header-left">
                <span class="user-display-name">{{ comment.createBy }}</span>
                <div class="host">
                  <el-tooltip class="item" :open-delay="500" effect="dark" :content="comment.modifiedDate | formatTime" placement="bottom">
                    <span class="comment-timestamp">{{ comment.modifiedDate | relativeTime }}</span>
                  </el-tooltip>
                  <!-- <span class="comment-timestamp">commented just now</span> -->
                </div>
              </div>
              <div class="comment-header-right">
                <div class="comment-toolbar">
                  <el-row>
                    <el-button class="comment-toolbar-reaction-button" icon="el-icon-user-solid" />
                    <el-button class="comment-toolbar-reaction-button" icon="el-icon-edit" @click="comment.isEdit=true" />
                    <el-dropdown trigger="click" placement="bottom-end">
                      <el-button class="comment-toolbar-reaction-button" icon="el-icon-more" />
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><div @click="delComment(index)"><i class="el-icon-delete" />删除</div></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-row>
                </div>
              </div>
            </div>
            <!-- 评论内容 -->
            <div class="comment-content" v-html="comment.context" />
          </div>
          <!-- 编辑区 -->
          <div v-else class="wit-right-editor">
            <editor :pre-html="comment.context" :need-focus="true" tips="添加评论" radius="5" @updateEditorHtml="matchEditorHtml(comment, $event)" />
            <el-row class="mt10" type="flex" justify="end">
              <el-button class="comment-toolbar-reaction-button" size="mini" type="info" @click="comment.isEdit=false">取消</el-button>
              <!-- <el-button class="comment-toolbar-reaction-button" size="mini" type="primary" disabled>更新</el-button> -->
              <el-button class="comment-toolbar-reaction-button" size="mini" type="primary" @click="updateComment">更新</el-button>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editor from '@/components/board/editor'
import moment from 'moment'

export default {
  name: 'Comment',
  components: {
    editor
  },
  filters: {
    relativeTime(date) {
      if (!date) return ''
      return moment(date).fromNow()
    },
    formatTime(date) {
      if (!date) return ''
      return moment(date).format('YYYY年M月DD日  HH:mm:ss')
    }
  },
  props: {
    // 接收解析该json字符串 做增删查改操作
    commentJsonStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: false,
      contentHtml: '<p class="user-display-name">用户</p>',
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      commentList: [
        // {
        //   id: 1,
        //   itemId: 1,
        //   createBy: 'Admin',
        //   createDate: 1567565305033,
        //   context: '<p>six six six</p>',
        //   modifiedBy: 'Admin',
        //   modifiedDate: 1567565305033,
        //   url: ''
        // }
      ]
    }
  },
  watch: {
    // 解析传入过来的评论字符串  解析完后是array格式
    commentJsonStr(nv) {
      if (nv) {
        this.commentList = JSON.parse(nv)
      }
    }
  },
  mounted() {
    if (this.commentJsonStr) {
      this.commentList = JSON.parse(this.commentJsonStr)
    }
  },
  methods: {
    matchEditorHtml(comment, $event) {
      // 比对修改后的值 与当前值  值一样 不触发事件
      if (comment.context === $event) {
        console.log('TCL: updateEditorHtml -> this.commentList[index].context', '返回值与插入值相等,不触发事件')
      } else {
        comment.context = $event
        // Object.assign(this.commentList, { isEdit: false })
        this._commentJsonStr = JSON.stringify(this.commentList.map(item => {
          return Object.assign({}, item, { isEdit: false })
        }))
        // this._commentJsonStr = JSON.stringify(this.commentList.map(item => {
        //   return Object.assign(item, { isEdit: false })
        // }))
        // this.$emit('updateCommentJsonStr', JSON.stringify(this.commentList))
        // this.$emit('updateCommentJsonStr', JSON.stringify(this.commentList))
      }
    },
    addComment(html) {
      const comment = {
        id: 1,
        itemId: 1,
        createBy: 'Admin',
        createDate: +new Date(),
        context: html,
        modifiedBy: 'Admin',
        modifiedDate: +new Date(),
        url: '',
        isEdit: false
      }
      const _arr = [comment, ...this.commentList]
      this.$emit('addComment', JSON.stringify(_arr))
    },
    updateComment(index, $event) {
      this.$emit('updateCommentJsonStr', this._commentJsonStr)
      console.log('TCL: updateComment -> this._commentJsonStr', this._commentJsonStr)
    },
    delComment(index) {
      this.$confirm('确定要删除该评论吗？', {
        distinguishCancelAndClose: true,
        cancelButtonText: '取消',
        confirmButtonText: '删除'
      })
        .then(() => {
          this.commentList.splice(index, 1)
          this.$emit('updateCommentJsonStr', JSON.stringify(this.commentList))
        })
        .catch(action => {

        })
    },
    initEditor() {
      this.$refs.commentEditor.initEditor()
    }
    // open() {
    //   this.$confirm('确定要放弃此草稿吗？', {
    //     distinguishCancelAndClose: true,
    //     confirmButtonText: '丢弃',
    //     cancelButtonText: '取消'
    //   })
    //     .then(() => {
    //       this.$message({
    //         type: 'info',
    //         message: '保存修改'
    //       })
    //     })
    //     .catch(action => {
    //       this.$message({
    //         type: 'info',
    //         message: action === 'cancel'
    //           ? '放弃保存并离开页面'
    //           : '停留在当前页面'
    //       })
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.comments-section {
  // overflow-y: auto;
  position: relative;
  min-height: 75px;
}
.mt10{
  margin-top: 10px;
}
.wit-comment-item {
  min-height: 32px;
  margin-bottom: 7px;
  position: relative;
  clear: both;
  .comment-item-left {
    position: absolute;
    top: 0;
    left: 0;
  }
  .comment-item-right {
    margin-left: 34px;
  }
}
.wit-comment-viewer {
  border: 1px solid;
  border-color: rgba(234,234,234,1);
  border-radius: 5px;
  padding-top: 8px;
  padding-left: 12px;
  padding-right: 12px;
  overflow-x: hidden;
  .comment-header {
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    height: 34px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 14px;
    .comment-header-left {
      display: flex;
      justify-content: flex-start;
      max-width: 85%;
      margin-top: 4px;
      .user-display-name {
        margin-right: 5px;
        color: rgba(0,0,0,.55);
        font-weight: bold;
        flex: 1 1 auto;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .host{
        display: inline-block;
      }
      .comment-timestamp {
        flex: 0 0 100%;
        font-size: 85%;
        color: rgba(0,0,0,.55);
        color: var(--text-secondary-color,rgba(0, 0, 0, .55));
        line-height: 17px;
        white-space: nowrap;
      }
    }
    .comment-header-right {
      white-space: nowrap;
      font-size: 14px;
      margin: 4px;
      .comment-toolbar {
        opacity: 1;
      }
      // /*&:hover {
      //   .comment-toolbar {
      //     opacity: 1;
      //   }
      // }*/
      .comment-toolbar-reaction-button {
        padding: 4px;
        align-items: center;
        border-radius: 2px;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        flex-direction: row;
        flex-shrink: 0;
        font-family: inherit;
        font-size: 16px;
        // font-size: inherit;
        font-weight: 600;
        justify-content: center;
        outline: none;
        overflow: visible;
        // padding: 6px 12px;
        color: rgba(0,0,0,.9);
        position: relative;
        transition: background 80ms linear;
        &:hover{
          background-color: rgba(0,0,0,.06);
        }
        &:active{
          background-color: rgba(0,0,0,.2);
        }
        +.comment-toolbar-reaction-button{
          margin-left: 0;
        }
      }
    }
  }
  .comment-content {
    color: rgba(0,0,0,.9);
    word-wrap: break-word;
    font-size: 14px;
    word-wrap: break-word;
    margin-bottom: 20px;
  }
  .wit-reaction-status-container {
    display: flex;
    padding-bottom: 12px;
  }
}
</style>
