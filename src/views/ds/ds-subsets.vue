<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>子集设置<Expand :expand.sync="expand"/>
        <i class="ii el-icon-circle-plus"  @click="subsets.push({name:'',labels:{},trafficPolicy:{}})" ></i>
          <span v-show="tips">可用于(金丝雀发布)、覆盖服务级别定义的流量策略</span>
      </span>
      <el-form v-show="expand" :inline="true" v-for="(subset,index) in subsets"
               style="width: 90%;border: solid 1px #ddd;margin-left: 20px;padding:20px;margin-top: 20px">
        <el-form-item label="子集名称(必填)">
          <el-input v-model="subset.name"/>
          <el-button type="primary"   @click="subsets.splice(index,1)">
            <i class="el-icon-delete"  ></i></el-button>
        </el-form-item>
        <el-form-item label="标签" style="width:100%">
          <MapMatch :data.sync="subset.labels" placeholder="小写"/>
          <span v-show="tips">可根据标签进行服务的过滤</span>
        </el-form-item>
        <el-form-item label="流量策略" style="width:100%">
          <TrafficPolicy :data.sync="subset.trafficPolicy" :tips="tips" />
          <span v-show="tips">子集继承在 DestinationRule 级别指定的流量策略。在子集指定将覆盖在 DestinationRule级别 </span>
        </el-form-item>
      </el-form>
    </div>


  </el-card>
</template>
<script>
 export default {
   props:["data","tips"],
   data(){
     return {
       subsets:[],
       expand:true
     }
   },
   created(){
     this.initData()
   },
   methods:{
     initData(){
       this.subsets=this.data
       if(this.subsets===undefined || this.subsets===null){
         this.subsets=[]
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
     subsets:{ //监听lb变化
       handler(newVal,oldVal){
         this.$emit("update:data",newVal)
       },
       deep:true
     },
   },
   components:{
     Expand:()=>import("@/views/common/card-expand.vue"),
     MapMatch:()=>import("@/views/common/MapMatch.vue"),
     TrafficPolicy:()=>import("./ds-trafficpolicy.vue"),
   }
 }
</script>
