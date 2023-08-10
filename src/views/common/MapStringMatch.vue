<template>
  <div>
    <i class="ii el-icon-circle-plus"  @click="addMapSlice" ></i>
    <el-form v-for="(item,index) in mapSlice" style="margin-top: 5px">

      <el-form-item >
        <el-input :placeholder="placeholder"    v-model="item.key" style="width: 120px;margin-left:10px"/>
      </el-form-item>
      <el-form-item ><StringMatch :data.sync="item.value"  />  </el-form-item>
      <el-form-item > <i class="ii el-icon-remove-outline"  @click="rmMapSlice(index)" ></i>
      </el-form-item>

    </el-form>

  </div>
</template>
<script>
  export  default {
    props:["data","placeholder"],
    data(){
      return {
        mapSlice:[],  //{key:'字符串',value:{StringMatch}}
        mapObject:{}   //最终 产生的对象 {xxx:StringMatch}

      }
    },
    created(){
       if(this.data!==undefined){
         this.mapObject=this.data
          for(var key in this.mapObject){
            this.mapSlice.push({key,value:this.data[key]})
          }
       }
    },
    methods:{
      addMapSlice(){
        this.mapSlice.push({})
      },
      rmMapSlice(index){
        this.mapSlice.splice(index,1)
      },
      change(index){
          if(this.mapSlice[index].key!==''){
            this.mapObject[this.mapSlice[index].key]=this.mapSlice[index].value
          }
      },
      //把 slice解析为object
      parseSliceToObject(){
        var obj={}
        for(var i=0;i<this.mapSlice.length;i++){
          if(this.mapSlice[i].key!==''){
            obj[this.mapSlice[i].key]=this.mapSlice[i].value
          }
        }
        this.mapObject=obj
      }
    },
    watch:{
      mapSlice:{
        handler:function(newVal,oldVal) {
          this.parseSliceToObject()
        },
        deep: true
      },
      mapObject:{
        handler:function(newVal,oldVal) {
          var ret={}
          for(var key in newVal ){
              var getMatch=newVal[key] //这里取到一个StringMatch对象 .要判断  StringMatch里面的值是否填，不填不作处理
              for(var matchKey in getMatch){
                if(getMatch[matchKey]!==''){
                  ret[key]=getMatch
                }
              }
          }
          this.$emit("update:data",ret)
        },
        deep: true

      },
    },
    components:{
      StringMatch:()=>import("@/views/common/StringMatch.vue")
    }
  }
</script>
