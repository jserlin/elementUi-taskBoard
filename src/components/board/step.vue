<template>
  <div class="step-wrap">
    <!-- 操作区 -->
    <div class="toolbar">
      <ul class="menu-bar">
        <li class="menu-item" @click="insertStep">
          <i class="el-icon-right" />
        </li>
        <li class="menu-item" :class="{'disabled': stepData.length < 2 || stepCurrentIndex === 0}" @click="sortStep('up')">
          <i class="el-icon-top" />
        </li>
        <li class="menu-item" :class="{'disabled': stepData.length < 2 || stepCurrentIndex === stepData.length - 1}" @click="sortStep('down')">
          <i class="el-icon-bottom" />
        </li>
        <li class="menu-item" @click="delStep">
          <i class="el-icon-close" />
        </li>
        <li class="menu-item" @click="showUpload = true">
          <i class="el-icon-paperclip" />
        </li>
      </ul>
    </div>
    <!-- 步骤列表-->
    <el-table
      ref="multipleTable"
      highlight-current-row
      :data="stepData"
      max-height="230"
      border
      tooltip-effect="dark"
      @row-click="rowClick"
    >
      <el-table-column
        label="Steps"
        width="70"
      >
        <template slot-scope="scope">{{ scope.$index + 1 }}.</template>
      </el-table-column>
      <el-table-column
        label="Action"
        min-width="260"
      >
        <template slot-scope="scope">
          <editable-div :html="scope.row.action" @update="scope.row.action=$event" />
        </template>
      </el-table-column>
      <el-table-column
        label="Expected result"
        min-width="200"
      >
        <template slot-scope="scope">
          <editable-div :html="scope.row.result" @update="scope.row.result=$event" />
        </template>
      </el-table-column>
      <el-table-column
        label="Attachments"
        width="200"
      >
        <template slot-scope="scope">
          <div
            v-for="(attach, attachIndex) in scope.row.attachments"
            :key="'attach-' + attachIndex"
            class="attach-wrap"
          >
            <span class="name">{{ attach.name }}</span>
            <i class="el-icon-close" @click="delAttach(scope.row.attachments, attachIndex)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="test-step-add" :class="{acive: !stepData.length}" @click="insertStep('last')">
      Click or type here to add a step
    </div>
    <upload :show="showUpload" @update:fileList="updateFileList" @update:visible="showUpload = $event" />
  </div>
</template>

<script>
import editableDiv from './editableDiv'
import upload from './upload'
import { Promise } from 'q'

export default {
  name: 'StepEditor',
  components: {
    editableDiv,
    upload
  },
  props: {
    stepsJsonStr: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      stepCurrentIndex: '',
      stepData: [
        // {
        //   action: 'add item',
        //   result: 'Insert list',
        //   attachments: [
        //     {
        //       name: 'file1.docx',
        //       url: ''
        //     }
        //   ],
        //   careteTime: +new Date()
        // }
      ],
      showUpload: false
    }
  },
  watch: {
    stepsJsonStr(nv) {
      if (nv) {
        this.stepData = JSON.parse(nv)
      }
    }
  },
  mounted() {
    if (this.stepsJsonStr) {
      this.stepData = JSON.parse(this.stepsJsonStr)
    }
  },
  methods: {
    // 点击行 设置索引
    rowClick(row) {
      this.stepCurrentIndex = this.stepData.findIndex(item => item.careteTime === row.careteTime)
    },
    // 派发更新后的数据
    updateStpsData() {
      return new Promise((resolve, reject) => {
        this.$emit('update:steps', JSON.stringify(this.stepData))
        resolve()
      })
    },
    // 上传附件后 同步附件列表
    updateFileList(fileList) {
      const _arr = fileList.map(file => {
        return {
          name: file.name,
          url: ''
        }
      })
      const _currentIndex = this.stepCurrentIndex === '' ? 0 : this.stepCurrentIndex
      this.stepData[_currentIndex].attachments = [...this.stepData[_currentIndex].attachments, ..._arr]
    },
    // 上下移动行
    sortStep(type = 'up') {
      if (type === 'down') {
        if (this.stepCurrentIndex !== this.stepData.length - 1) {
          this.stepData[this.stepCurrentIndex] = this.stepData.splice(this.stepCurrentIndex + 1, 1, this.stepData[this.stepCurrentIndex])[0]
          this.stepCurrentIndex++
        }
      } else {
        if (this.stepCurrentIndex !== 0) {
          this.stepData[this.stepCurrentIndex ] = this.stepData.splice(this.stepCurrentIndex - 1, 1, this.stepData[this.stepCurrentIndex ])[0]
          this.stepCurrentIndex--
        }
      }
    },
    // 插入行
    insertStep(type = 'frist') {
      const stepItem = {
        action: '',
        result: '',
        attachments: '',
        careteTime: +new Date()
      }
      if (type === 'last') {
        this.stepData.push(stepItem)
      } else {
        this.stepData = [stepItem, ...this.stepData]
      }
    },
    // 删除行
    delStep() {
      if (!this.stepData.length) return
      if (this.stepCurrentIndex !== '') {
        this.stepData.splice(this.stepCurrentIndex, 1)
        this.stepCurrentIndex = ''
        return
      }
      this.stepData.pop()
    },
    // 删除附件
    delAttach(attachArr, index) {
      attachArr.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .step-wrap {
    .test-step-add {
      padding: 5px 0;
      text-indent: 80px;
      cursor: pointer;
      &.acive{
        background-color: #F5F7FA
      }
      &:hover {
        background-color: #F5F7FA
      }
    }
  }
  .attach-wrap {
    cursor: pointer;
    .name {
      color: rgba(16,110,190,1);
      &:hover {
        text-decoration: underline;
      }
    }
    .icon {
      color: rgba(218,10,0,1);
      font-size: 20px;
    }
  }
  .menu-bar {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    .menu-item{
      display: inline-block;
      margin: 0 2.5px 0 0;
      padding: 9px;
      cursor: pointer;
      font-size: 14px;
      max-height: 36px;
      line-height: 16px;
      color: #000;
      &:hover {
        outline: none;
        background-color: rgba(222,236,249,1);
      }
      &:active {
        outline: none;
        background-color: rgba(43,136,216,1);
      }
      &.disabled {
        cursor: default;
        color: rgba(166,166,166,1);
        &:hover {
          outline: none;
          background-color: transparent;
        }
        &:active {
        outline: none;
        background-color: rgba(222,236,249,1);
      }
      }
    }
  }
</style>
<style lang="scss">
.work-item-title {
  margin-left: 5px;
  &:hover{
    color: rgba(16,110,190,1);
    text-decoration: underline;
    cursor: pointer;
  }
}
.step-wrap {
  .el-table__empty-block {
    display: none;
  }
  .el-table td, .el-table th {
    padding: 5px 0
  }
  .el-table--border td {
    border-right: 1px solid transparent;
  }
  .el-table th.is-leaf {
      border-right: 1px solid transparent;
      &:hover {
        border-right: 1px solid rgba(234,234,234,1);
        background-color: rgba(234,234,234,1)
      }
  }
  .el-table--border::after, .el-table--group::after, .el-table::before {
      // content: '';
      // position: absolute;
      background-color: transparent;
      // z-index: 1;
  }
  .el-table td, .el-table th.is-leaf {
      border-bottom: 1px solid transparent;
  }
  .el-table--border, .el-table--group {
    border: 1px solid transparent;
  }
}
</style>
