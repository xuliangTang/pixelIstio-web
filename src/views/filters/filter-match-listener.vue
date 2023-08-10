<template>
   <el-form :inline="true">
     <el-form-item label="端口">
      <el-input-number :min="0"/>
       <span v-show="tips"> 发送/接收流量的服务端口/网关端口。如未指定，则匹配所有侦听器</span>
     </el-form-item>
     <el-form-item label="名称">
       <el-input-number :min="0"/>
      </el-form-item>
   </el-form>
</template>
<script>

  export default {
    props:["data","tips"],
    data(){
      return {
        listener:{},
      }
    },
    methods: {
      initData() {
        this.listener = this.data
      },
    },
    watch: {
      data: {
        handler(n, o) {
          this.initData()
        },
        deep: true
      },
    }
  }
</script>
