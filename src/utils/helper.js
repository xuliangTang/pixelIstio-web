export function isEmptyObject(obj){ //判定对象是否为空  如 {}

  if(obj===null || obj===undefined) return true

  return Object.keys(obj).length===0
}
export function clearEmptyObject(obj){  //清除 空对象属性 ,是一个递归
  for( var key in obj ) {
    if(obj[key]===undefined || obj[key]===null  ){
      delete obj[key]
      continue
    }
    if ( typeof obj[key] === "object" ){ //如果是对象, object和array 都会 返回object
      if(Array.isArray(obj[key])){ //数组要遍历
        for(var i=0;i<obj[key].length;i++){
           clearEmptyObject(obj[key][i])
        }
      }else{
        if( isEmptyObject(obj[key])){
          delete obj[key]
        }else{
           clearEmptyObject(obj[key])
        }
      }
    }
  }
  return obj
}
