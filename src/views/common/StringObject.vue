<template>
  <div>
    <i class="ii el-icon-circle-plus"  @click="addSlice" ></i>
    <el-form v-for="(item,index) in propList" style="margin-top: 5px">
      <el-form-item >
         <el-select @change="change" v-model="item.key" style="width: 100px" >
          <el-option v-for="item in selectList" :label="item"  :value="item"/>
        </el-select>
       </el-form-item>
      <el-form-item >
        <el-input :placeholder="placeholder"  @change="change"   v-model="item.value" style="width: 120px;margin-left:10px"/>
      </el-form-item>
      <el-form-item > <i class="ii el-icon-remove-outline"  @click="rmSlice(index)" ></i>
      </el-form-item>
    </el-form>

   </div>
</template>
<script>
  export  default {
    //props 可以传 类似 a,b,c 作为可选属性
    props:["data","placeholder","props"],
    data(){
      return {
        objectData:{},    // 譬如{uri:"xxxxx",authority:""}   属性是父组件传的，不一定是固定的
        propList:[],  // [{key:'',value:''}]
      }
    },
    created(){
      this.objectData=this.data
      if(this.objectData===null || this.objectData===undefined){
        this.objectData={}
      }else{
        this.unParseObject()
      }
    },
    computed:{
       selectList(){ //下拉框里要显示的列表， 就是 属性props按照逗号切分
         return this.props.split(",")
       }
    },
    methods:{
      addSlice(){
        this.propList.push({key:'',value:''})
      },
      rmSlice(index){
        this.propList.splice(index,1)
        this.change()
      },
      //把对象解析出来，赋值给matchKey和matchValue
      unParseObject(){
          for(var key in this.objectData){
            this.propList.push({key,value:this.objectData[key]})
          }
      },
      change(){
        this.objectData={}//清空
       for(var i=0;i<this.propList.length;i++){
         if(this.propList[i].value!=='')
            this.objectData[this.propList[i].key]=this.propList[i].value
       }
      }
    },
    watch:{
      objectData:{
        handler:function(newVal,oldVal) {
          this.$emit("update:data",newVal)
        },
        deep: true

      },
    }
  }
</script>
