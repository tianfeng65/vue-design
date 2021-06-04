/**
 * 以前我们通过将数据塞入模版生成html字符串（html片段）
 * 然后插入html中来进行页面渲染的，数据变化则重新执行compiler.
 *  */ 

import  {template} from 'lodash'

let templateCache = null
const MyComponent = (props) => {
  const compiler = templateCache || (templateCache = template('<h1><%= title %></h1>'))
  return compiler(props)
}

const titleObj = {title: 'this is title'}
const htmlString = MyComponent(titleObj)
// console.log({htmlString})
document.getElementById('app').innerHTML = htmlString

setTimeout(() => {
  titleObj.title= 'this is new title'
  document.getElementById('app').innerHTML = MyComponent(titleObj)
}, 2000);