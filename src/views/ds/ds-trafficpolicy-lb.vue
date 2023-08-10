<template>
<div>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>负载均衡配置 <el-checkbox v-model="enable" />(点此启用)
          <span v-show="tips">常用的有simple和consistentHash</span>
      </span>
      <el-form  style="margin-top: 10px">
        <el-form-item label="选择类型">
          <el-select  v-model="lb.lb_type" style="width: 150px" >
            <el-option  label="简单类型"  value="simple"/>
            <el-option  label="一致性hash"  value="consistentHash"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设置策略" v-show="lb.lb_type==='simple'">
          <el-select  v-model="lb.lb_value_simple" style="width: 200px" >
            <el-option  v-for="item in lb_simple" :label="item.key" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="设置策略" v-show="lb.lb_type!=='simple'">
          <el-select @change="changeHash" v-model="lb.lb_value_hash.key" style="width: 200px" >
            <el-option  v-for="item in lb_consistentHash" :label="item.key" :value="item.value"/>
          </el-select>
          <!-- 字符串类型-->
          <el-input v-model="lb.lb_value_hash.str_value"
                     style="width: 250px;margin-left: 10px"
                    :placeholder="placeholder"
                    v-show="lb.lb_value_hash.key!=='useSourceIp' && lb.lb_value_hash.key!=='httpCookie'"/>
          <!-- 针对cookie-->
          <el-form :inline="true" style="margin-top: 10px" v-show="lb.lb_value_hash.key==='httpCookie'">
            <el-form-item label="cookie名称(必填)">
              <el-input v-model="lb.lb_value_hash.obj_value.name"/>
            </el-form-item>
            <el-form-item label="cookie路径">
              <el-input v-model="lb.lb_value_hash.obj_value.path"/>
            </el-form-item>
            <el-form-item label="生命周期(必填:如 2s 代表2秒">
              <el-input v-model="lb.lb_value_hash.obj_value.ttl"/>
            </el-form-item>
          </el-form>
        </el-form-item>
        <!--<el-form-item label="哈希环数量" v-show="lb.lb_type!=='simple'">-->
           <!--<el-input-number :min="1" v-model="lb.minimumRingSize" />-->
           <!--<span v-show="tips">用于哈希环的最小虚拟节点数。默认为 1024。更大的环尺寸会导致更精细的负载分布。如果负载均衡池中的主机数量大于环大小，每个主机将被分配一个虚拟节点</span>-->
        <!--</el-form-item>-->
      </el-form>
    </div>
  </el-card>

</div>

</template>
<script>
  export default {
    props:["data","tips"],
    data(){
      return {
        lb:{
          lb_type:'',//负载均衡类型
          lb_value_simple:'' ,// 负载均衡配置(针对simple类型)，默认是 simple->ROUND_ROBIN
          lb_value_hash:{
            key:'',str_value:'',bool_value:true,obj_value:{}
          }, //针对一致性hash的配置 是一个对象
    //      minimumRingSize:1024 暂时去掉
        },
        lb_simple:[
          {key:'轮询(默认)',value:'ROUND_ROBIN'},
          {key:'最少请求',value:'LEAST_CONN'},
          {key:'随机',value:'RANDOM'},
        ],
        lb_consistentHash:[
          {key:'基于http头',value:'httpHeaderName',placeholder:'请填写http头的name'},
          {key:'基于httpCookie',value:'httpCookie',placeholder:'请填写http头的name'},
          {key:'源 IP 地址',value:'useSourceIp',placeholder:''},  //这个填的是true或false
          {key:'基于query参数',value:'httpQueryParameterName',placeholder:'请填写query参数名'},
        ],
        placeholder: '请填写http头的name',
        enable:false  //是否启用
      }
    },
    created() {

    },
    methods: {
      changeHash() { //一致性哈希 发生选择改变时  触发
        this.lb_consistentHash.forEach(item => {
          if (this.lb.lb_value_hash.key === item.value)  //设置 文本框要显示的placeholder  .对cookie 和 ip方式无效
            this.placeholder = item.placeholder
        })
      },
      contianersKey(obj,key){
        if(obj===undefined || obj ===null) return false
        for(var k in obj){
          if(k===key)
            return true
        }
        return false
      },
      unParseLbObject(newdata){  //编辑状态下 需要反解  到  lb 对象中
        if(newdata===undefined || newdata===null) return
        for(var key in newdata){
          this.enable=true
          this.$set(this.lb,"lb_type",key)//这是通用的，所以直接赋值
          if(key==='simple'){  //简单类型
            this.$set(this.lb,"lb_value_simple",newdata[key])//简单类型 这就是一个字符串
          }else{
            let hashobject=newdata[key]     //一致性哈希，这是一个对象

            for(var hashkey in hashobject){
              if(hashkey==='minimumRingSize'){  //特殊属性。
                //this.$set(this.lb,"minimumRingSize",hashobject[hashkey])
                continue
              }
              this.$set(this.lb.lb_value_hash,"key",hashkey)
             if(this.contianersKey(hashobject,'httpHeaderName') || this.contianersKey(hashobject,'httpQueryParameterName')){
               //字符串类型
               this.$set(this.lb.lb_value_hash,"str_value",hashobject[hashkey])
             }else if(this.contianersKey(hashobject,'useSourceIp') ){
               this.$set(this.lb.lb_value_hash,"bool_value",true)
             }else {
               this.$set(this.lb.lb_value_hash,"obj_value",hashobject[hashkey])
             }
              break
            }
          }
          break //只处理一次
        }
      },
      genLbObject() {  //根据选择生成 lb配置。 watch的时候要用
        if (this.lb.lb_type === 'simple') { //简单类型直接  取lb_type和lb_value
          return { simple: this.lb.lb_value_simple }
        } else { //一致性hash类型
          let ret = {}
          //下面字符串类型
          if (this.lb.lb_value_hash.key === 'httpHeaderName' || this.lb.lb_value_hash.key === 'httpQueryParameterName') {
            ret[this.lb.lb_value_hash.key] = this.lb.lb_value_hash.str_value
          } else if (this.lb.lb_value_hash.key === 'useSourceIp') {  //这个是bool形
            ret[this.lb.lb_value_hash.key] = true
          } else { //cookie类型 ，这里面又是一个对象
            ret[this.lb.lb_value_hash.key] = this.lb.lb_value_hash.obj_value
          }
        //  ret['minimumRingSize'] = this.lb.minimumRingSize
          return {consistentHash:ret}
        }
      },
    },
    computed:{
      valueList(){
        if(this.lb.lb_type==='simple'){
          return this.lb_simple
        }
      }
    },
    watch:{
      data:{  //监听属性变化
        handler(n,o){
         this.unParseLbObject(n)

        },
        deep:true
      },
      enable:{
        handler(n,o){
          if(n){
            this.$emit("update:data",this.genLbObject())
          }else{
            this.$emit("update:data",{})  //禁用这返回空对象
          }
        },
        deep:true
      },
      lb:{ //监听lb变化
        handler(newVal,oldVal){
          if(!this.enable || this.lb.lb_type===''){
             return
          }

          this.$emit("update:data",this.genLbObject())

          },
        deep:true
        },

      }

  }
</script>
