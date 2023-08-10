<template>
  <div>
   <el-form>
     <el-form-item label="每连接最大请求数">
       <el-input-number v-model="httpConfig.maxRequestsPerConnection" :min="0" :max="536870912" label="描述文字"  ></el-input-number>
       <span v-show="tips">(将此参数设置为 1 将禁用keepalive。默认0，表示“无限制”，最多 2^29)</span>
     </el-form-item>
     <el-form-item label="最大等待请求数">
       <el-input-number style="width: 250px" v-model="httpConfig.http1MaxPendingRequests" :min="1"  :max="defaultAttr.http1MaxPendingRequests"  ></el-input-number>
       <span v-show="tips">(最大等待请求数,默认 2^32-1)</span>
     </el-form-item>
     <el-form-item label="最大请求数">
       <el-input-number style="width: 250px" v-model="httpConfig.http2MaxRequests" :min="1" :max="defaultAttr.http2MaxRequests"  ></el-input-number>
       <span v-show="tips">(最大请求数,默认 2^32-1)</span>
     </el-form-item>
     <el-form-item label="最大重试次数">
       <el-input-number style="width: 250px" v-model="httpConfig.maxRetries" :min="1"  :max="defaultAttr.maxRetries"  ></el-input-number>
       <span v-show="tips">(最大重试次数,默认 2^32-1)</span>
     </el-form-item>
   </el-form>
  </div>
</template>
<script>
  import {isEmptyObject} from '@/utils/helper'
  export default {
    props:["data","tips","enable"],
    data(){
      return {
        httpConfig:{},
        defaultAttr:{
          maxRequestsPerConnection:0,
          http1MaxPendingRequests:4294967295,
          http2MaxRequests:4294967295,
          maxRetries:4294967295,
        },

      }
    },
    created() {
      this.initData()

    },
    methods:{
      initData(){
        this.httpConfig=this.data
        if(this.httpConfig===undefined || this.httpConfig==null){
          this.httpConfig={}
        }
      },
      // setData(data){
      //     this.httpConfig=data
      //     this.$forceUpdate()
      // }
    },
    watch:{
      data:{
        handler(n,o){
          this.initData()

        },
        deep: true
      },
      enable:{
        handler(n,o){
          if(n){
            this.$emit("update:data",this.httpConfig)
          }else{
            this.$emit("update:data",{})  //禁用这返回空对象
          }
        },

      },
      httpConfig:{ //监听lb变化
        handler(newVal,oldVal){
          if(this.enable){
            this.$emit("update:data", newVal)
          }

        },
        deep:true
      },
    }
  }
</script>
