<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
      <span>连接池配置 <el-checkbox v-model="enable" />(点此启用)
          <span v-show="tips">上游服务的连接池设置，可应用到tcp和http层，可用于限流设置</span>
      </span>
        <el-tabs v-model="activeName"  >
          <el-tab-pane label="http设置" name="http">
              <HttpConfig   :data.sync="connectionPool.http" :tips="tips" :enable="enable"/>

          </el-tab-pane>
          <el-tab-pane label="tcp设置" name="tcp">
            <TcpConfig :data.sync="connectionPool.tcp" :tips="tips" :enable="enable"/>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {isEmptyObject,clearEmptyObject} from '@/utils/helper'
  export default {
    props:["data","tips"],
    data(){
      return {
        activeName:'http',
        connectionPool:{http:{},tcp:{}},
        enable: false,

      }
    },
    mounted(){

    },
    methods:{
       initData(){
         this.connectionPool=this.data
         if(this.connectionPool===undefined){
           this.connectionPool={http:{},tcp:{}}
         }

       }
    },
    watch:{
      data:{
        handler(n,o){
          this.initData()
          if(n!==undefined){
            if(!isEmptyObject(clearEmptyObject(n.http))){
              this.enable=true
            }
          }

         },
        deep: true
      },
      connectionPool:{ //监听lb变化
        handler(newVal,oldVal){
          this.$emit("update:data",this.connectionPool)
        },
        deep:true
      },
    },
    components:{
        HttpConfig:()=>import('./ds-trafficpolicy-connpool-http.vue'),
        TcpConfig:()=>import('./ds-trafficpolicy-connpool-tcp.vue'),
    }
  }
</script>
