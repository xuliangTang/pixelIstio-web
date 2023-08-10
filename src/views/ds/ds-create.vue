<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <MetaData :tips.sync="tips" :data.sync="metadata"/>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Host配置 <Expand :expand.sync="expand"/> </span>
      </div>
      <SimpleString v-show="expand" :data.sync="spec.host" :tips="tips" label="host"  tech="填写服务名(service)，适用于http、tcp服务。建议使用完全限定名，如reviews.default.svc.cluster.local" />
    </el-card>

    <!--流量策略-->
    <TrafficPolicy :data.sync="spec.trafficPolicy" :tips="tips" />

    <!--子集配置-->
    <Subsets :data.sync="spec.subsets" :tips="tips" />
    <div>
      <json-viewer :value="json" :expand-depth=8 copyable  sort/>
    </div>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveDs"  >
        保存</el-button>
    </div>
  </div>
</template>
<script>
  import {createDS,updateDS,loadDS} from '@/api/ds'
  import {clearEmptyObject} from '@/utils/helper'
  export default {
    data(){
      return {
          metadata:{name:"",namespace:"myistio"},
          spec: {host:'',trafficPolicy:{}}, // vs的spec对象
          tips: false, //是否打开教学
          isUpdate:false,
          expand: true
      }
    },
    computed:{
      json(){
        return {metadata:this.metadata,spec:this.spec}
      }
    },
    created(){
      if(this.$route.params.ns!==undefined && this.$route.params.name!==undefined) {
        //代表是修改
        this.metadata.name = this.$route.params.name
        this.metadata.namespace = this.$route.params.ns
        const {namespace,name}=this.metadata
        loadDS(namespace,name).then(rsp=>{
          this.spec=rsp.data.data.spec
          this.isUpdate=true
          this.$forceUpdate()
        })
      }
    },
    methods:{
      saveDs(){
        var operatorFunc=createDS
        if(this.isUpdate){
          operatorFunc=updateDS
        }

        var spec=clearEmptyObject(this.spec)
        console.log(spec)
        operatorFunc({
          metadata:this.metadata,
          spec
        }).then(rsp=>{
          alert("成功")
        })
      }
    },
    components:{
      MetaData:()=>import("@/views/common/MetaData.vue"),
      SimpleString:()=>import("@/views/common/SimpleString.vue"),
      TrafficPolicy:()=>import("./ds-trafficpolicy.vue"),
      Expand:()=>import("@/views/common/card-expand.vue"),
      Subsets:()=>import("./ds-subsets.vue"),
    }
  }
</script>
