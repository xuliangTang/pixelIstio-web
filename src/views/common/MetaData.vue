<template>
  <div>
    <el-form  :inline="true">
      <el-form-item label="名称">
        <el-input  :disabled="isUpdate" v-model="metadata.name"   placeholder="目标规则名称"></el-input>
      </el-form-item>
      <el-form-item label="命名空间">
        <el-select :disabled="isUpdate"  v-model="metadata.namespace">
          <el-option v-for="ns in nslist "
                     :label="ns.Name"
                     :value="ns.Name"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-switch
          v-model="settips"
          active-text="打开教学"
          inactive-text="关闭教学"
        >
        </el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { getList  as getNsList  } from '@/api/ns'
  export  default {
    props:["data","isUpdate","tips"],
    data(){
      return {
        metadata:{name:"",namespace:"myistio"},
        nslist:[] , //ns列表
        settips:false
      }
    },
    created(){
      this.metadata=this.$props.data
      this.settips=this.tips
      getNsList().then(rsp=>{
        this.nslist=rsp.data.data
      })
    },
    methods:{

    },
    watch:{
      settips:{
        handler:function(newVal,oldVal) {
          this.$emit("update:tips",newVal)
        },
      },
      matchObject:{
        handler:function(newVal,oldVal) {
          this.$emit("update:data",newVal)
        },
        deep: true

      },
    }
  }
</script>
