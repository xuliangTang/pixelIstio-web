<template>
  <div>
   <el-form style="margin-top: 10px;width:90%;margin-left: 20px">
     <el-form-item>
       <el-switch
         v-model="enable"
         active-text="启用"
         inactive-text="禁用"
       >
       </el-switch>
     </el-form-item>
     <el-form-item  style="width:100%;margin-top:10px" label="重试次数" >
       <el-input-number  :min="1" placeholder="重试次数" style="width: 200px"
                        v-model="retry.attempts" />
       <span v-show="tips">允许的重试次数。重试间隔 (25ms+)</span>
     </el-form-item>
     <el-form-item  style="width:100%;margin-top:10px" label="请求超时">
       <el-input   placeholder="请求超时" style="width: 200px" v-model="retry.perTryTimeout" />
       <span v-show="tips">请求超时时间格式：1h/1m/1s/1ms。必须 >=1毫秒</span>
     </el-form-item>
     <el-form-item  style="width:100%;margin-top:10px"  label="重试策略">
       <el-input   placeholder="重试策略,多个请用 逗号分隔" style="width: 500px" v-model="retry.retryOn" />
       <span v-show="tips">具体请<a target="_blank" href="https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/router_filter#x-envoy-retry-on">点这里</a></span>
     </el-form-item>
   </el-form>
  </div>
</template>
<script>

  export default {
    props:["data","tips" ],
    data(){
      return {
        retry:{},
        enable:false
      }
    },
    mounted(){
      this.initData()
    },
    methods:{
      initData(){
        this.retry=this.data
        if(this.retry===undefined || this.retry===null){
          this.retry={}
        }else{
          for( var key in this.retry){
            this.enable=true
            break
          }
        }
      },
    },
    watch:{
      enable:{
        handler(n,o){
          if(n){
            this.$emit("update:data",this.retry)
          }else{
            this.$emit("update:data",{})  //禁用这返回空对象
          }
        },
        deep: true
      },
      retry:{ //监听retry变化
        handler(newVal,oldVal){
          if(this.enable){
            this.$emit("update:data", newVal)
          }
        },
        deep: true
      },
    }
  }
</script>
