<template>
  <div class="task-list-wrap">

    <!-- <el-row class="mt10" type="flex" justify="start">
      <el-button type="primary" icon="el-icon-plus">新增</el-button>
    </el-row> -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      border
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="ID"
        width="120"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        label="TItle"
        width="180"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span class="work-item-title" @click="linkToDetail(scope.row)">{{ scope.row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="assignTo"
        label="assigned To"
        show-overflow-tooltip
      />
    </el-table>
    <div style="margin-top: 20px">
      <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
      <el-button @click="toggleSelection()">取消选择</el-button> -->
    </div>
  </div>
</template>

<script>
import { getWorkItem } from '@/api/task'
export default {
  data() {
    return {
      tableData: [
        {
          id: '20160503',
          assigned: '王小虎',
          title: '普陀区金沙江路'
        }
      ],
      multipleSelection: []
    }
  },
  mounted() {
    this._getWorkItem()
  },
  methods: {
    _getWorkItem() {
      getWorkItem().then(res => {
        this.tableData = res
      })
    },
    linkToDetail(row) {
      this.$router.push({
        path: '/task/taskBoard',
        query: {
          id: row.id
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>
<style lang="scss">
.work-item-title {
  margin-left: 5px;
  &:hover{
    color: rgba(16,110,190,1);
    text-decoration: underline;
    cursor: pointer;
  }
}
.el-table--border td {
  border-right: 1px solid transparent;
}
.el-table th.is-leaf {
    border-right: 1px solid transparent;
    &:hover {
      border-right: 1px solid #EBEEF5;
    }
}
</style>
