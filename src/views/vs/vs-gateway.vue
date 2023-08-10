<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span  >gateway设置 <i class="ii el-icon-circle-plus"  @click="addGW" ></i></span>
      </div>
      <div v-show="$parent.tips">
        网关配置:如设置了此项，规则将仅适用于网关。如需同时适应于网关和sidecar，需增加mesh配置
      </div>
      <div>
        <el-form  :inline="true" v-for="(host,index) in gateways"  style="margin-top: 10px">
          <!--<el-input placeholder="填写网关名称" style="width: 150px" v-model="gateways[index]" />-->
         <el-select v-model="gateways[index]"   filterable
                    allow-create>
           <el-option-group
             v-for="item in allGateways"
             :key="item.ns"
             :label="item.ns">
             <el-option
               v-for="gw in item.list"
               :key="gw.metadata.name"
               :label="gw.metadata.name"
               :value="gw.metadata.name">
             </el-option>
           </el-option-group>
         </el-select>
          <el-button type="primary" style="margin-left: 20px"  @click="rmGW(index)">
            <i class="el-icon-minus"  ></i></el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  function copyObject(obj){
    var str=JSON.stringify(obj)
    return JSON.parse(str)
  }
  import {getGWList} from '@/api/gw'

  export default {
    data(){
      return {
        gateways:[],
        allGateways:{},   //  [ {ns:xx,list:xxxx} ] 这种形式
       }
    },
    created(){
      getGWList("").then(rsp=>{
        this.allGateways=rsp.data.data
      })
    },
    methods:{
      addGW(){
        this.gateways.unshift("")
      },
      rmGW(index){
        this.gateways.splice(index,1)
      },
      output(){
        return ''
      },
      setObject(v){
        this.gateways=copyObject(v)
      },
    },
    watch:{
      gateways:{
        handler:function(newVal,oldVal) {
          this.$parent.updateObject("gateways",newVal)
        },

      },
    }

  }
</script>
