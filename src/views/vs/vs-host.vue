<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span  >hosts设置 <i class="ii el-icon-circle-plus"  @click="addHost" ></i></span>
      </div>
      <div v-show="$parent.tips">
        Hosts:目标主机,通配符前缀的服务名或IP。适用于 HTTP 和 TCP服务
      </div>
      <div>
        <el-form  :inline="true" v-for="(host,index) in hosts"  style="margin-top: 10px">
          <el-input placeholder="填写host" style="width: 150px" v-model="hosts[index]" />

          <el-button type="primary" style="margin-left: 20px"  @click="rmHost(index)">
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
  export default {
    data(){
      return {
        hosts:[]
      }
    },
    methods:{
      addHost(){
        this.hosts.unshift("")
      },
      rmHost(index){
        this.hosts.splice(index,1)
      },
      output(){
        return ''
      },
      setObject(v){
        this.hosts=copyObject(v)
      },
    },
    watch:{
      hosts:{
        handler:function(newVal,oldVal) {
          this.$parent.updateObject("hosts",newVal)
          this.$forceUpdate()
        },

      },
    }

  }
</script>
