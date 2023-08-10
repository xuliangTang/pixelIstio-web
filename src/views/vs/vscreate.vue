<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form  :inline="true">
        <el-form-item label="名称">
          <el-input :disabled="isUpdate" v-model="metadata.name"   placeholder="虚拟服务名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <!--<el-input v-model="namespace"  placeholder="如default"></el-input>-->
          <el-select :disabled="isUpdate" v-model="metadata.namespace">
            <el-option v-for="ns in nslist "
                       :label="ns.Name"
                       :value="ns.Name"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="tips"
            active-text="打开教学"
            inactive-text="关闭教学"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-card>
    <Hosts ref="hostsConfig"></Hosts>
    <GatewayConfig ref="gatewayConfig"/>
    <HttpConfig ref="httpConfig" ></HttpConfig>

    <div>
      <json-viewer :value="spec" :expand-depth=8 copyable  sort/>
    </div>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveVs"  >
        保存</el-button>
    </div>

  </div>
</template>
<script>
  import { getList  as getNsList  } from '@/api/ns'
  import {createVS,loadVs,updateVS} from '@/api/vs'
  import {isEmptyObject,clearEmptyObject} from '@/utils/helper'
  export default {
    data(){
      return {
        metadata:{name:"",namespace:"default"},
        spec: {hosts:[],http:[],gateways:[]}, // vs的spec对象
        nslist:[] , //ns列表
        tips: false, //是否打开教学
        isUpdate:false,
      }
    },
    created(){
      getNsList().then(rsp=>{
        this.nslist=rsp.data.data
        //代表是修改
        if(this.$route.params.ns!==undefined && this.$route.params.name!==undefined){
           this.metadata.name=this.$route.params.name
          this.metadata.namespace=this.$route.params.ns
           const {namespace,name}=this.metadata
          loadVs(namespace,name).then(rsp=>{
            this.spec=rsp.data.data.spec
            this.isUpdate=true
            this.$refs.httpConfig.setObject(this.spec.http)
            this.$refs.hostsConfig.setObject(this.spec.hosts)
            this.$refs.gatewayConfig.setObject(this.spec.gateways)
          })
        }
      })
    },
    methods:{
      updateObject(propName,v){
        this.spec[propName]=Object.assign([],v)
      },


      saveVs(){
        var operatorFunc=createVS
        if(this.isUpdate){
          operatorFunc=updateVS
        }
        var spec= clearEmptyObject(this.spec)
        operatorFunc({
          metadata:this.metadata,
          spec
        }).then(rsp=>{
          alert("成功")
        })
      }
    },
    components:{
      Hosts:()=>import("./vs-host.vue"),
      HttpConfig:()=>import("./vs-http.vue"),
      GatewayConfig:()=>import("./vs-gateway.vue")
    }
  }
</script>
