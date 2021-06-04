import h, { Fragment, Portal } from './h'
import render from './render'
import MyClassComponent from './MyClassComponent'
import MyFunctionalComponent from './MyFunctionalConponent'
 
const dynamicClass = ['a', {b: true, c: false}]
// 多层级VNode
const elementVNode = h(
  'div', 
  {
    style: {
      height: '100px',
      width: '100px',
      background: 'red'
    },
    class: ['big', dynamicClass],
    onclick: () => alert('you clicked me!')
  },
  [
    h(
      'div', 
      {
        style: {
          height: '20px',
          width: '20px',
          background: 'green'
        },
        class: ['small', dynamicClass]
      },
    ),
    h(
      'input',
      {
        class: 'the-input',
        type: 'checkbox',
        checked: true,
        custom: 'custom'
      }
    ),
    h(
      'div',
      null,
      'this is a input'
    )  
  ]
)
// Fragment
const elementVNode2 = h(Fragment, null, [
  h('p', null, 'hello world'),
  h('p', null, '你好 世界')
])
// Portal
const elementVNode3 = h(Portal, {target: '#portal-box'}, [
  h('p', null, 'hello world'),
  h('p', null, '你好 世界')
])
// 类组件
const classComponentVNode = h(MyClassComponent)

// 函数组件
const functionComponentVNode = h(MyFunctionalComponent)

// render(elementVNode, document.getElementById('app5'))
// render(elementVNode2, document.getElementById('app5'))
// render(elementVNode3, document.getElementById('app5'))
// render(classComponentVNode, document.getElementById('app5'))
// setTimeout(() => {
//   render(functionComponentVNode, document.getElementById('app5'))
// }, 2000);


const prevElementVNode = h(
  'div',
  {
    style: {
      background: 'blue',
      width: '100px',
      height: '100px'
    }
  }
)
const nextElementVNode = h(
  'div',
  {
    style: {
      background: 'pink',
      width: '100px',
      height: '100px'
    }
  }
)

render(prevElementVNode, document.getElementById('app5'))
setTimeout(() => {
  render(nextElementVNode, document.getElementById('app5'))
}, 2000);