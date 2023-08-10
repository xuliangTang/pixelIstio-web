<template>
<div>
  <el-form :inline="true">
    <el-form-item label="应用位置" style="width: 100%">
      <el-select v-model="configPatch.applyTo">
        <el-option v-for="item in applyList" :label="item.value" :value="item.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="匹配配置" style="width: 100%;margin-top:10px">
      <el-form :inline="true" style="width: 100%;border: solid 1px #ddd;padding: 10px">
        <el-form-item label=" 上 下 文 "  style="width: 100%">
          <el-select v-model="configPatch.match.context">
            <el-option v-for="item in contextList" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="代理版本"  style="width: 100%;margin-top: 10px">
            <el-input v-model="proxyVersion"/>
          <span v-show="tips">可用于设置代理版本，不匹配则不生效，填正则字符串,如^1\.9.*</span>
        </el-form-item>
        <el-form-item label="匹配方式"  style="width: 100%;margin-top: 10px">
          <el-select  v-model="matchType">
            <el-option label="侦听器" value="listener"></el-option>
            <el-option label="Http路由" value="routeConfiguration"></el-option>
            <el-option label="集群" value="listener"></el-option>
          </el-select>
         </el-form-item>
        <el-form-item   style="width: 100%;margin-top: 10px">
          <div style="width:500px;margin-left: 20px;border:solid 1px #ddd;padding:20px">
            <Listener :tips="tips" :data.sync="matchData"  />
          </div>

        </el-form-item>
      </el-form>
    </el-form-item>
  </el-form>
</div>
</template>
<script>

  export default {
    props:["data","tips"],
    data(){
      return {
        configPatch:{applyTo:'',match:{}},
        contextList:[
          {key:'GATEWAY',value:'网关'},
          {key:'SIDECAR_INBOUND',value:'Sidecar入站'},
          {key:'SIDECAR_OUTBOUND',value:'Sidecar出站'},
          {key:'ANY',value:'所有'},
        ],
        matchType:'',//匹配类型 listener routeConfiguration  cluster
        applyList:[
          {key:'LISTENER',value:'侦听器'},
          {key:'FILTER_CHAIN',value:'过滤器链'},
          {key:'NETWORK_FILTER',value:'网络过滤器链'},
          {key:'HTTP_FILTER',value:'HTTP 过滤器链'},
          {key:'ROUTE_CONFIGURATION',value:'HTTP路由配置'},
          {key:'VIRTUAL_HOST',value:'虚拟主机'},
          {key:'HTTP_ROUTE',value:'虚拟主机路由对象'},
          {key:'CLUSTER',value:'集群'},
        ]
      }
    },
    methods:{
      initData(){
        this.configPatch=this.data
      },
      matchTypeChange(){

      }
    },
    computed:{
      matchData:{
        get(){
          return this.configPatch.match[this.matchType]
        },
        set(v){
          this.$set(this.configPatch.match,this.matchType,v)
        }
      },
      proxyVersion:{
        get () {
           if(this.configPatch.match.proxy)
             return this.configPatch.match.proxy.proxyVersion
           else
             return ''
        },
        set (value) {
          if(!this.configPatch.match.proxy)
             this.$set(this.configPatch.match,"proxy",{proxyVersion:value})
          else
            this.$set(this.configPatch.match.proxy,"proxyVersion",value)

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
      configPatch:{
        handler(n,o){
          this.$emit("update:data",n)
        },
        deep:true
      },

    },
    components:{
      Listener:()=>import("./filter-match-listener.vue")
    }
  }
</script>
