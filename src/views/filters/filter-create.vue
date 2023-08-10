<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <MetaData :tips.sync="tips" :data.sync="metadata"/>
      <el-form :inline="true">
        <el-form-item label="标签匹配">
          <MapMatch v-show="expand" :data.sync="spec.workloadSelector.labels" :tips="tips" label="host"   />
          <span v-show="tips">如果省略，该EnvoyFilter 将应用于同一命名空间中的所有工作负载</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>条件配置 <i class="ii el-icon-circle-plus"  @click="spec.configPatches.push({applyTo:''})" ></i>   </span>
      </div>
      <el-form :inline="true">

        <el-form-item v-for="(cp,cpindex) in spec.configPatches">
          <ConfigPatch :data.sync="spec.configPatches[cpindex]" :tips="tips"/>
        </el-form-item>
      </el-form>


    </el-card>

    <!--流量策略-->



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
        spec: {workloadSelector:{},configPatches:[]}, // vs的spec对象
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

    },
    methods:{
      saveDs(){

      }
    },
    components:{
      MetaData:()=>import("@/views/common/MetaData.vue"),
      MapMatch:()=>import("@/views/common/MapMatch.vue"),
      ConfigPatch:()=>import("./filter-configpatch.vue"),
      Expand:()=>import("@/views/common/card-expand.vue"),

    }
  }
</script>
