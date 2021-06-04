import ChildrenFlags from "./ChildrenFlags"
import VNodeFlags from "./VNodeFlags"

export default function render(vnode, container) {
  const prevVNode = container.vnode
  if(prevVNode === undefined) {
    if(vnode) {
      // 如果只有新的VNode，没有旧的VNode，那么就是挂载
      mount(vnode, container)
      // 并且要把VNode记录下来，作为下一次渲染的旧值
      container.vnode = vnode
    }
  } else {
    if(vnode) {
      // 如果新旧VNode都存在，那么就是对比更新（打补丁）
      patch(prevVNode, vnode, container)
      container.vnode = vnode
    } else {
      // 旧的VNode存在，新的不存在，那么就是移除
      container.removeChild(prevVNode.el)
      container.vnode = undefined
    }
  }
}

function mount(vnode, container, isSVG) {
  const {flags} = vnode
  if(flags & VNodeFlags.ELEMENT) {
    mountElement(vnode, container, isSVG)
  } else if(flags & VNodeFlags.COMPONENT) {
    mountComponent(vnode, container, isSVG)
  } else if( flags & VNodeFlags.TEXT) {
    mountText(vnode, container)
  } else if (flags & VNodeFlags.FRAGMENT) {
    mountFragment(vnode, container, isSVG)
  } else if(flags & VNodeFlags.PORTAL) {
    mountPortal(vnode, container, isSVG)
  }
}

const domPropsRE = /\[A-Z]|^(?:value|checked|selected|muted)$/

function mountElement(vnode, container, isSVG) {
  isSVG = isSVG || vnode.flags & VNodeFlags.ELEMENT_SVG
  const el = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
    : document.createElement(vnode.tag) 
  vnode.el = el
  // 处理data
  const {data} = vnode
  if(data) {
    for(let key in data) {
      switch(key) {
        case 'style': 
          for(let k in data.style) {
            el.style[k] = data.style[k]
          }
          break
        case 'class': 
          if (isSVG) {
            el.setAttribute('class', data[key])
          } else {
            el.className = data[key]
          }
          break
        default:
          if(key[0] === 'o' && key[1] === 'n') {
            // 事件
            el.addEventListener(key.slice(2), data[key])
          } else if(domPropsRE.test(key)) {
            // DOM Props
            el[key] = data[key]
          } else {
            // Attr
            el.setAttribute(key, data[key])
          }
          break
      }
    }
  }
  // 处理children
  const {childFlags, children} = vnode
  if(childFlags !== ChildrenFlags.NO_CHILDREN) {
    if(childFlags & ChildrenFlags.SINGLE_VNODE) {
      mount(children, el, isSVG)
    } else if(childFlags & ChildrenFlags.MULTIPLE_VNODES) {
      for(let child of children) {
        mount(child, el, isSVG)
      }
    }
  }
  container.appendChild(el)
}

function mountText(vnode, container) {
  const el = document.createTextNode(vnode.children)
  vnode.el = el
  container.appendChild(el)
}

function mountFragment(vnode, container, isSVG) {
  const {childFlags, children} = vnode
  switch(childFlags) {
    case ChildrenFlags.NO_CHILDREN: 
      // 如果没有子节点，等价于挂载空片段，使用一个空文本节点占位
      const placeholder = createTextNode('')
      mountText(placeholder, container)
      // 没有子节点指向占位的空文本节点
      vnode.el = placeholder.el
      break
      case ChildrenFlags.SINGLE_VNODE: 
      mount(vnode, container, isSVG)
      // 单个子节点，就指向该节点
      vnode.el = children.el
      break
    default:
      // 多个子节点，遍历一下
      for(let child of children) {
        mount(child, container, isSVG)
      }
      // 多个子节点，指向第一个子节点
      vnode.el = children[0].el
  }
}

function mountPortal(vnode, container, isSVG) {
  const {tag, children, childFlags} = vnode
  // 获取挂载点
  const target = typeof tag === 'string' ? document.querySelector(tag) : tag
  if(childFlags & ChildrenFlags.SINGLE_VNODE) {
    mount(children, target, isSVG)
  } else if(childFlags & ChildrenFlags.MULTIPLE_VNODES) {
    for(let child of children) {
      mount(child, target)
    }
  }
  //留下占位的空文本节点
  const placeholder = createTextNode('')
  mount(placeholder, container, null)
  vnode.el = placeholder.el
}

function mountComponent(vnode, container, isSVG) {
  if(vnode.flags & VNodeFlags.COMPONENT_STATEFUL) {
    mountStatefulComponent(vnode, container, isSVG)
  } else {
    mountFunctionalComponent(vnode, container, isSVG)
  }
}

function mountStatefulComponent(vnode, container, isSVG) {
  // 创建组件实例
  const instance = new vnode.tag()
  // 渲染VNode
  instance.$vnode = instance.render()
  // 挂载
  mount(instance.$vnode, container, isSVG)
  // el 属性值 和 组件实例的 $el 属性都引用组件的根DOM元素
  instance.$el = vnode.el = instance.$vnode.el
} 

function mountFunctionalComponent(vnode, container, isSVG) {
  // 获取VNode
  const $vnode = vnode.tag()
  // 挂载
  mount($vnode, container, isSVG)
  vnode.el = $vnode.el
}

function patch (prevVNode, nextVNode, container) {
  const {flags: nextFlags} = nextVNode
  const {flags: prevFlags} = prevVNode

  if(prevFlags !== nextFlags) {
    replaceVNode(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.ELEMENT) {
    patchElement(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.COMPONENT) {
    patchComponent(prevVNode, nextVNode, container) 
  } else if (nextFlags & VNodeFlags.TEXT) {
    patchText(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.FRAGMENT) {
    patchFragment(prevVNode, nextVNode, container)
  } else if (nextFlags & VNodeFlags.PORTAL) {
    patchPortal(prevVNode, nextVNode)
  }
}

function replaceVNode(prevVNode, nextVNode, container) {
  container.removeChild(prevVNode.el)
  mount(nextVNode, container)
}

function patchElement(prevVNode, nextVNode, container) {
  // 如果新旧 VNode 描述的是不同的标签，则调用 replaceVNode 函数，使用新的 VNode 替换旧的 VNode
  if(prevVNode.tag !== nextVNode.tag) {
    replaceVNode(prevVNode, nextVNode, container)
    return 
  }
  // 拿到 el 元素，注意这时要让 nextVNode.el 也引用该元素
  const el = (nextVNode.el = prevVNode.el)
  // 拿到新旧VNodeData
  const prevData = prevVNode.data
  const nextData = nextVNode.data
  // 新的VNodeData存在才有必要更新
  if (nextData) {
    for(let key in nextData) {
      const prevValue = prevData[key]
      const nextValue = nextData[key]
      switch(key) {
        case 'style': 
          for(let k in nextValue) {
            el.style[k] = nextValue[k]
          }
          for(let k in prevValue) {
            if(!nextValue.hasOwnProperty(k)) {
              el.style[k] = ''
            }
          }
          break

        default:
          break
      }
    }
  }
}
