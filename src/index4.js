/**
 * 用VNode描述真实DOM
 */
//一个100px红色背景的正方形div
const elementVNode = {
  //用 tag 属性来存储标签的名字
  tag: 'div',
  //用 data 属性来存储该标签的附加信息，比如 style、class、事件等，通常我们把一个 VNode 对象的 data 属性称为 VNodeData
  data: {
    width: '100px',
    height: '100px',
    backgroundColor: 'red'
  },
}

// div包含一个span
const element2VNode = {
  tag: 'div',
  data: null,
  children: {
    tag: 'span',
    data: null
  }
}

// div包含多个span
const element3VNode = {
  tag: 'div',
  data: null,
  children: [
    {
      tag: 'span',
      data: null
    },
    {
      tag: 'span',
      data: null
    },
  ]
}

// div包含一个文本节点
const element4VNode = {
  tag: 'div',
  data: null,
  children: 'this is text children'
}
// 一个纯文本节点
const textElemnetVNode = {
  tag: null,
  data: null,
  children: 'this is text element'
}

 
 /**
  * 一个div包含自定义组件
  * <div>
      <MyComponent />
    </div>
  */
const element5VNode = {
  tag: 'div',
  data: null,
  children: {
    //我们可以通过检查 tag 属性值是否是字符串来确定一个 VNode 是普通标签还是组件名。
    tag: MyComponent,
    data: null
  }
}
// Fragment：如果组件没有一个根节点，则需要使用Fragment作为根节点，否则无法使用VNode表示这样的层级
/**
 * 形如：const MyComponent = () => {
          return ({
            <div></div>
            <div></div>
          })
        }
 */
const Fragment = Symbol()
const fragmentVNode = {
  tag: Fragment,
  data: null,
  children: [
    {
      tag: 'div',
      data: null
    },
    {
      tag: 'div',
      data: null
    }
    
  ]
}

// Portal:传送门
{/* <template>
  <Portal target="#app-root">
    <div class="overlay"></div>
  </Portal>
</template> */}
const Portal = Symbol()
const portalVNode = {
  tag: Portal,
  data: {
    target: '#app-root'
  },
  children: {
    tag: 'div',
    data: {
      class: 'overlay'
    }
  }
}

/**
 * 总的来说，我们可以把VNode分类成为：html元素、组件、纯文本、Fragment、Portal，我们在VNode上加上组件的标识。
 */

 const VNodeFlags = {
  // html 标签
  ELEMENT_HTML: 1,
  // SVG 标签
  ELEMENT_SVG: 1 << 1,

  // 普通有状态组件
  COMPONENT_STATEFUL_NORMAL: 1 << 2,
  // 需要被keepAlive的有状态组件
  COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
  // 已经被keepAlive的有状态组件
  COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
  // 函数式组件
  COMPONENT_FUNCTIONAL: 1 << 5,

  // 纯文本
  TEXT: 1 << 6,
  // Fragment
  FRAGMENT: 1 << 7,
  // Portal
  PORTAL: 1 << 8
}

// html 和 svg 都是标签元素，可以用 ELEMENT 表示
VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG
// 普通有状态组件、需要被keepAlive的有状态组件、已经被keepAlice的有状态组件 都是“有状态组件”，统一用 COMPONENT_STATEFUL 表示
VNodeFlags.COMPONENT_STATEFUL =
  VNodeFlags.COMPONENT_STATEFUL_NORMAL |
  VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE |
  VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE
// 有状态组件 和  函数式组件都是“组件”，用 COMPONENT 表示
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL

//同样，对children的类型也可以标识

const ChildrenFlags = {
  // 未知的 children 类型
  UNKNOWN_CHILDREN: 0,
  // 没有 children
  NO_CHILDREN: 1,
  // children 是单个 VNode
  SINGLE_VNODE: 1 << 1,

  // children 是多个拥有 key 的 VNode
  KEYED_VNODES: 1 << 2,
  // children 是多个没有 key 的 VNode
  NONE_KEYED_VNODES: 1 << 3
}
// “多节点”标识
ChildrenFlags.MULTIPLE_VNODES = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEYED_VNODES

// 没有子节点的 div 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'div',
  data: null,
  children: null,
  childFlags: ChildrenFlags.NO_CHILDREN
}
// 文本节点的 childFlags 始终都是 NO_CHILDREN
const textVNode = {
  tag: null,
  data: null,
  children: '我是文本',
  childFlags: ChildrenFlags.NO_CHILDREN
}
// 拥有多个使用了key的 li 标签作为子节点的 ul 标签
const elementVNode = {
  flags: VNodeFlags.ELEMENT_HTML,
  tag: 'ul',
  data: null,
  childFlags: ChildrenFlags.KEYED_VNODES,
  children: [
    {
      tag: 'li',
      data: null,
      key: 0
    },
    {
      tag: 'li',
      data: null,
      key: 1
    }
  ]
}
// 只有一个子节点的 Fragment
const elementVNode = {
  flags: VNodeFlags.FRAGMENT,
  tag: null,
  data: null,
  childFlags: ChildrenFlags.SINGLE_VNODE,
  children: {
    tag: 'p',
    data: null
  }
}

// 至此，我们已经对 VNode 完成了一定的设计，目前为止我们所设计的 VNode 对象如下：

// export interface VNode {
//   // _isVNode 属性在上文中没有提到，它是一个始终为 true 的值，有了它，我们就可以判断一个对象是否是 VNode 对象
//   _isVNode: true
//   // el 属性在上文中也没有提到，当一个 VNode 被渲染为真实 DOM 之后，el 属性的值会引用该真实DOM
//   el: Element | null
//   flags: VNodeFlags
//   tag: string | FunctionalComponent | ComponentClass | null
//   data: VNodeData | null
//   children: VNodeChildren
//   childFlags: ChildrenFlags
// }