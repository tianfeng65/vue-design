/**
 * 这一节我们不实用第三方的snabbdom创建VNode，以及渲染挂载更新VNode，我们自己实现一个最简单的案例。
 */

// 自定义一个VNode
const elementVNode = {
  tag: 'div',
}
// 自定义一个函数组件
function MyComponent () {
  return ({
    tag: 'div'
  })
}
// 使用VNode描述组件
const componentVNode = {
  tag: MyComponent
}

// 渲染器负责解析VNode为真实DOM并挂载在页面上
function render(vnode, container) {
  // 如果VNode是一个原生DOM节点
  if(typeof vnode.tag === 'string') {
    mountElementVNode(vnode, container)
  } else {
    // 如果VNode是一个自定义组件
    mountComponentVNode(vnode, container)
  }
}
function mountElementVNode(vnode, container) {
  const el = document.createElement(vnode.tag)
  container.appendChild(el)
}
function mountComponentVNode(vnode, container) {
  // 在这里我们获取到了我们想要的VNode
  const elementVNode = vnode.tag()
  mountElementVNode(elementVNode, container)
}
render(elementVNode, document.getElementById('app3'))
render(componentVNode, document.getElementById('app3'))
// 这样id为app3的节点下就挂载了两个空的div