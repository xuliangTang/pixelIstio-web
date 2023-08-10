<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置(用于接收传入或传出的 HTTP/TCP 连接,描述了一组公开的端口、要使用的协议类型、负载均衡配置等)</span>
      </div>
      <el-form :inline="true"  >
        <el-form-item label="名称">
          <el-input :disabled="isUpdate" v-model="metadata.name"   placeholder="网关名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select :disabled="isUpdate" v-model="metadata.namespace">
            <el-option v-for="ns in nslist "
                       :label="ns.Name"
                       :value="ns.Name"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-switch
            v-model="tips"
            active-text="打开教学"
            inactive-text="关闭教学"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签配置 (常见的是app: istio-ingressgateway)<i class="ii el-icon-circle-plus"  @click="selector.push({key:'',value:''})" ></i></span>
      </div>
      <el-form  :inline="true">
        <el-form-item   v-for="(item,index) in selector">
          <el-form  :inline="true">
            <el-form-item label="标签Key">
              <el-input  @change="parseSelector"  v-model="item.key"   placeholder="标签Key"></el-input>
            </el-form-item>
            <el-form-item label="标签值">
              <el-input   @change="parseSelector"  v-model="item.value"   placeholder="标签值"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="rmSelector(index)" v-show="index>0"> - </el-button>
            </el-form-item>
          </el-form>


        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>server配置 <i class="ii el-icon-circle-plus"  @click="addEmptyServer" ></i></span>
      </div>
      <el-form   style="border-top: solid 1px #ddd;padding-top:10px"   v-for="(server,serverindex) in spec.servers">
        <el-form-item label="名称">
          <el-input v-model="server.name" style="width: 150px"/>
        </el-form-item>
        <el-form-item label="hosts配置" >
          <el-card class="box-card" style="width: 30%">
            <div  >
              <span>点此增加 (*代表全部，或者填写域名格式的字符串,必须填一个) <i class="ii el-icon-circle-plus"  @click="addEmptyServerHost(serverindex)" ></i></span>
            </div>
            <el-form >
              <el-form-item   v-for="(h,hostindex) in server.hosts">
                <el-input v-model="server.hosts[hostindex]" style="width: 150px"  />
                <el-button type="primary" @click="rmServerHost(serverindex,hostindex)"  > - </el-button>
              </el-form-item>

            </el-form>
          </el-card>
        </el-form-item>
        <el-form-item label="端口配置" >
          <el-form :inline="true">
            <el-form-item  label="名称" >
              <el-input placeholder="必填" v-model="server.port.name" style="width:100px"  />
            </el-form-item>
            <el-form-item  label="端口号" >
              <el-input v-model="server.port.number"  style="width:100px"  />
             </el-form-item>
            <el-form-item  label="目标端口" >
              <el-input v-model="server.port.targetPort"  style="width:100px"  />
            </el-form-item>
            <el-form-item  label="协议" >
              <el-select v-model="server.port.protocol">
                <el-option  label="HTTP"  value="HTTP"/>
                <el-option  label="HTTPS"  value="HTTPS"/>
                <el-option  label="GRPC"  value="GRPC"/>
                <el-option  label="HTTP2"  value="HTTP2"/>
                <el-option  label="MONGO"  value="MONGO"/>
                <el-option  label="TCP"  value="TCP"/>
                <el-option  label="TLS"  value="TLS"/>
              </el-select>
            </el-form-item>

          </el-form>
        </el-form-item>
      </el-form>

    </el-card>
    <div>
      <json-viewer :value="spec" :expand-depth=8 copyable  sort/>
    </div>
    <div style="margin-top: 20px;text-align: center">
      <el-button type="primary" @click="saveVs"  >
        保存</el-button>
    </div>

  </div>
</template>
<script>
  import { getList  as getNsList  } from '@/api/ns'
  import {createGateWay,loadGW,updateGateWay} from '@/api/gw'
  function copyObject(obj){
    var str=JSON.stringify(obj)
    return JSON.parse(str)
  }
  const emptyServer={name:'',
    port:{name:'',number:80,protocol:'HTTP',targetPort:80},
    hosts:[]
  }
  export default {
    data(){
      return {
        metadata:{name:"",namespace:"myistio"},
        spec: {selector:{},servers:[]}, // gw的spec对象
        selector:[],// [{key,value}]
        nslist:[] , //ns列表
        tips: false, //是否打开教学
        isUpdate:false,
      }
    },
    created(){
      getNsList().then(rsp=>{
        this.nslist=rsp.data.data
        //代表是修改
        if(this.$route.params.ns!==undefined && this.$route.params.name!==undefined){
           this.metadata.name=this.$route.params.name
          this.metadata.namespace=this.$route.params.ns
           const {namespace,name}=this.metadata
          loadGW(namespace,name).then(rsp=>{

            this.spec=rsp.data.data.spec
            //这里需要处理 selector 。
            this.isUpdate=true
            this.unParseSelector()
          })
        }
      })
    },
    methods:{
      rmSelector(index){
        for(var i=0;i<this.selector.length;i++){
          this.selector.splice(index,1)
        }
        this.parseSelector()
      },
      addEmptyServer(){
        this.spec.servers.unshift(copyObject(emptyServer))
      },
      //添加server 里面的空host
      addEmptyServerHost(serverindex){
        this.spec.servers[serverindex].hosts.push("")
      },
      rmServerHost(serverindex,hostindex){
        this.spec.servers[serverindex].hosts.splice(hostindex,1)
      },
      unParseSelector(){//编辑状态下把spec.selector里的内容 解析为selector 数组
        if(this.spec.selector!==undefined && this.spec.selector!==null ){
          for(var key in this.spec.selector){
            this.selector.push({key,value:this.spec.selector[key]})
          }
        }
      },
      parseSelector(){ //把selector里的内容 解析为spec.selector对象
        this.spec.selector={}
        for(var i=0;i<this.selector.length;i++){
          if(this.selector[i].key!=="" &&  this.selector[i].value!=="")
             this.$set(this.spec.selector,this.selector[i].key,this.selector[i].value)

        }

      },
      saveVs(){
        const operFunc=this.isUpdate?updateGateWay:createGateWay

        operFunc({metadata:this.metadata,spec:this.spec}).then(rsp=>{
          alert("成功")
        })
      }
    },
    components:{

    }
  }
</script>
