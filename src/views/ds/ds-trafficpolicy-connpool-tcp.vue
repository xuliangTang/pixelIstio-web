<template>
  <div>
   <el-form>
     <el-form-item label="最大tcp连接数">
       <el-input-number v-model="tcpConfig.maxConnections" :min="0" :max="4294967295"    ></el-input-number>
       <span v-show="tips">( 到目标主机的最大 HTTP1 /TCP 连接数。默认 2^32-1)</span>
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
        tcpConfig:{},
      }
    },
    created() {
      this.initData()

    },
    methods:{
      initData(){
        this.tcpConfig=this.data
        if(this.tcpConfig===undefined || this.tcpConfig==null){
          this.tcpConfig={}
        }
      },

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
            this.$emit("update:data",this.tcpConfig)
          }else{
            this.$emit("update:data",{})  //禁用这返回空对象
          }
        },

      },
      tcpConfig:{ //监听lb变化
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
