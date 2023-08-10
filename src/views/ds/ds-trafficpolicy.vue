<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>流量策略<Expand :expand.sync="expand"/>
          <span v-show="tips">要应用的流量策略（负载平衡策略、连接池大小、异常值检测）</span>
      </span>
    </div>
    <!-- 负载均衡配置-->
    <Lb v-show="expand" :data.sync="trafficPolicy.loadBalancer" :tips="tips"/>
    <!-- 连接池配置-->
    <ConnPool v-show="expand"  :data.sync="trafficPolicy.connectionPool" :tips="tips"/>
    <!-- 熔断 配置-->
    <OutlierDetection v-show="expand"  :data.sync="trafficPolicy.outlierDetection" :tips="tips"/>

  </el-card>
</template>
<script>
  import {isEmptyObject} from '@/utils/helper'

  export default {
   props:["data","tips"],
   data(){
     return {
       trafficPolicy:{},
       expand:false
     }
   },
   created(){
     this.initData()
   },
    methods:{
     initData(){
       this.trafficPolicy=this.data
       if(!isEmptyObject(this.trafficPolicy)){
         this.expand=true
       }
     }
    },
   watch:{
     data:{
       handler(n,o){
         this.initData()

       },
       deep:true
     },
     trafficPolicy:{ //监听lb变化
       handler(newVal,oldVal){
         this.$emit("update:data",newVal)
       },
       deep:true
     },
   },
   components:{
      Lb:()=>import("./ds-trafficpolicy-lb.vue"),
     ConnPool:()=>import("./ds-trafficpolicy-connpool.vue"),
     OutlierDetection:()=>import("./ds-trafficpolicy-outlierdetection.vue"),
     Expand:()=>import("@/views/common/card-expand.vue"),
   }
 }
</script>
