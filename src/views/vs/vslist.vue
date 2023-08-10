<template>
  <div>
    <div style="padding: 20px">
      <span>选择命名空间:</span>
      <el-select placeholder="选择命名空间" @change="changeNs" v-model="namespace">
        <el-option v-for="ns in nslist "
                   :label="ns.Name"
                   :value="ns.Name"/>
      </el-select>

    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="名称" width="100" align="center">
        <template slot-scope="scope">
        <router-link :to="{name:'Vscreate',params:{ns:scope.row.metadata.namespace,name:scope.row.metadata.name}}">
          {{ scope.row.metadata.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.metadata.creationTimestamp }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-link  @click="()=>rmVS(scope.row.metadata.namespace,scope.row.metadata.name )" >删除<i class="el-icon-delete el-icon--right"></i></el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import { getVsList ,deleteVS } from '@/api/vs'
  import { NewClient } from "@/utils/ws"
  import { getList  as getNsList } from '@/api/ns'
  export default {
    data(){
      return {
        list: null,
        listLoading: true,
        wsClient:null,
        namespace: 'myistio',
        nslist:[]
      }
    },
    created() {

        getNsList().then(rsp=>{
          this.nslist=rsp.data.data
        })
        this.fetchData()

    },
    methods: {
      changeNs(ns){
        getVsList(ns).then(rsp=>{
          this.list=rsp.data.data
        })
      },
      rmVS(ns,name){
        this.$confirm('是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteVS(ns,name)
        })
      },
      fetchData()
      {
        this.listLoading = true
        // 通过rest api 获取
        getVsList(this.namespace).then(response => {
          this.list = response.data.data
          this.listLoading = false
        })
        this.wsClient = NewClient()
        this.wsClient.onmessage = (e) => {
          if (e.data !== 'ping') {
            const object = JSON.parse(e.data)
            if (object.type === 'vs' && object.result.ns===this.namespace) {
              this.list = object.result.data
              this.$forceUpdate()
            }
          }
        }
      }
      ,
    }
  }
</script>
