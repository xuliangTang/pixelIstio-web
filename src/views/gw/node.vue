<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="Node">
        <template slot-scope="scope">
          {{ scope.row.Name }}
          <br>
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="Info" width="180">
        <template slot-scope="scope">
          {{ scope.row.Name }}
          <br>
          {{ scope.row.Name }}
          <br>
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="State">
        <template slot-scope="scope">
          {{ scope.row.State }}
        </template>
      </el-table-column>
      <el-table-column label="Pod">
        <template slot-scope="scope">
          {{ scope.row.Name }}/{{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="CPU">
        <template slot-scope="scope">
          {{ scope.row.Name }}m
          <br>
          {{ scope.row.Name }}m
        </template>
      </el-table-column>
      <el-table-column label="Memory">
        <template slot-scope="scope">
          {{ scope.row.Name }}Mi
          <br>
          {{ scope.row.Name }}Mi
        </template>
      </el-table-column>
      <el-table-column label="CreationTime">
        <template slot-scope="scope">
          {{ scope.row.Name }}
        </template>
      </el-table-column>
      <el-table-column label="More">
        <!-- Label Annotation Taint Affinity Drain -->
        <template slot-scope="scope">
        <el-dropdown>
      <span class="el-dropdown-link">
        下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

  import { getList  as getNsList } from '@/api/ns'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      centerDialogVisible: false,
      app: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getNsList().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleClick() {
      alert('button click')
    }
  }
}
</script>
