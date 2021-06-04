import {init,h} from 'snabbdom'

const MyComponent = props => {
  return h('h1', props.title)
}

//这时候调用我们的组件函数生成的是VNode
const vNode = MyComponent({title: 'this is title2'})
// console.log({vNode})
/**
{
  sel: 'h1',
  data: {},
  children: undefined,
  text: 'this is a title',
  elm: undefined,
  key: undefined
}
 */

// init方法用于创建patch函数，用于将VNode转换为真实DOM并插入到页面。
const patch = init([])
patch(document.getElementById('app2'), vNode)


/**
 * 注意这里的区别，我们没有再使用像上面的调用来更新页面，
 * 而是把前后VNode传给patch进行比对，
 * 从而从更细的粒度进行页面内容更新，而不是一把梭的替换，所以patch更大的作用是用于VNode变更前后的对比。
 */
setTimeout(() => {
  const newVNode = MyComponent({title: 'this is new titlt2'})
  patch(vNode, newVNode)
}, 2000);


// 从VNode变成真实的DOM的工作肯定需要什么东西去完成，我们称之为“渲染器”（Renderer）。
