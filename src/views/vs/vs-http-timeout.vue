<template>
  <div>
   <el-form>
     <el-form-item  style="width:100%">
       <el-input placeholder="格式：1h/1m/1s/1ms" style="width: 200px" v-model="timeout" />
       <el-switch
         v-model="enable"
         active-text="启用"
         inactive-text="禁用"
       >
       </el-switch>
       <span v-show="tips">HTTP请求超时，默认禁用。</span>
     </el-form-item>

   </el-form>
  </div>
</template>
<script>

  export default {
    props:["data","tips" ],
    data(){
      return {
        timeout:"",
        enable:false
      }
    },
    mounted(){
      this.initData()
    },
    methods:{
      initData(){
        this.timeout=this.data

        if(this.timeout!==undefined && this.timeout!==null && this.timeout!==''){
          this.enable=true
        }
      },

    },
    watch:{

      enable:{
        handler(n,o){
          if(n){
            this.$emit("update:data",this.timeout)
          }else{
            this.$emit("update:data",null)  //禁用这返回空对象
          }
        },

      },
      timeout:{ //监听lb变化
        handler(newVal,oldVal){
          if(this.enable){
            this.$emit("update:data", newVal)
          }
        },
      },
    }
  }
</script>
