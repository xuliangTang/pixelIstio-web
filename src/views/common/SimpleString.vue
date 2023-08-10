<template>
<div>
  <el-form  style="margin-top: 5px">
    <el-form-item  :label="label">
      <el-input style="width:220px" :placeholder="placeholder" v-model="text" />
      <span v-show="tips">{{tech}}</span>
    </el-form-item>
  </el-form>
</div>

</template>
<script>
  export  default {
    props:["data","placeholder", "label","tech","tips"],
    data(){
      return {
        text:''
      }
    },
    mounted() {
      this.text=this.data
    },
    watch:{
      data:function(newVal,oldVal){
        this.text=this.data
      },
      text:function(newVal,oldVal) {
         this.$emit("update:data",newVal)
      }
    }
  }
</script>
