<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
      <span>异常检测(熔断器) <el-checkbox v-model="enable" />(点此启用)
          <span v-show="tips">一个断路器(熔断器)实现,适用于 HTTP 和 TCP 服务。对于 HTTP 服务，持续为 API 调用返回 5xx 错误的主机会在预定义的时间段内从池中被驱逐。
            对于 TCP 服务，在测量连续错误指标时，与给定主机的连接超时或连接失败计为错误</span>
      </span>
        <el-form style="margin-top: 20px">
          <el-form-item label=" 5xx 错误数">
            <el-input-number v-model="outlierDetection.consecutive5xxErrors" :min="0"  ></el-input-number>
            <span v-show="tips">(连接超时、连接错误/失败和请求失败事件都属于 5xx 错误。此功能默认为 5，但可以通过将值设置为 0 来禁用)</span>
          </el-form-item>
          <el-form-item label="扫描间隔">
            <el-input style="width: 100px" v-model="outlierDetection.interval"   ></el-input>
            <span v-show="tips">(错误异常的扫描间隔，格式：1h/1m/1s/1ms。必须 >=1 毫秒。默认为 10 秒 , 10秒内 连续发生consecutiveErrors个异常，则熔断)</span>
          </el-form-item>
          <el-form-item label="最短驱逐时间">
            <el-input  style="width: 100px" v-model="outlierDetection.baseEjectionTime"  ></el-input>
            <span v-show="tips">(熔断后的最小持续时间。将保持的Host的熔断次数*最短时间，格式1h/1m/1s/1ms。必须 >=1 毫秒。默认为 30 秒)</span>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {isEmptyObject,clearEmptyObject} from '@/utils/helper'
  export default {
    props:["data","tips"],
    data(){
      return {

        outlierDetection:{},
        enable: false,

      }
    },
    mounted(){

    },
    methods:{
       initData(){
         this.outlierDetection=this.data
         if(this.outlierDetection===undefined){
           this.outlierDetection={}
         }

       }
    },
    watch:{
      enable:{
        handler(n,o){
          if(n){
            this.$emit("update:data",this.outlierDetection)
          }else{
            this.$emit("update:data",{})  //禁用这返回空对象
          }
        },
        deep:true
      },
      data:{
        handler(n,o){
          this.initData()
          if(!isEmptyObject(clearEmptyObject(n))){
            this.enable=true
          }
         },
        deep: true
      },
      outlierDetection:{ //监听lb变化
        handler(newVal,oldVal){
          this.$emit("update:data",newVal)
        },
        deep:true
      },
    },
    components:{

    }
  }
</script>
