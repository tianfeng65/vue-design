import VNodeFlags from './VNodeFlags'
import ChildrenFlags from './ChildrenFlags'
export const Fragment = Symbol()
export const Portal = Symbol()
export default function h(tag, data = null, children = null) {
  let flags = null
  if(typeof tag === 'string') {
    flags = tag === 'svg' ? VNodeFlags.ELEMENT_SVG : VNodeFlags.ELEMENT_HTML
    if(data) {
      data.class = normalizeClass(data.class)
    }
  } else if(tag === Fragment) {
    flags = VNodeFlags.FRAGMENT
  } else if(tag === Portal) {
    flags = VNodeFlags.PORTAL
    tag = data && data.target
  } else {
    if(typeof tag === 'function') {
      flags = tag.prototype && tag.prototype.render
        ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
        : VNodeFlags.COMPONENT_FUNCTIONAL
    }
  }
  
  let childFlags = null
  if(Array.isArray(children)) {
    const {length} = children
    if(length === 0) {
      childFlags = ChildrenFlags.NO_CHILDREN
    } else if (length === 1) {
      childFlags = ChildrenFlags.SINGLE_VNODE
    } else {
      childFlags = ChildrenFlags.KEYED_VNODES
      children = normalizeVNodes(children)
    }
  } else if(children === null ){
    childFlags = ChildrenFlags.NO_CHILDREN
  } else if(children._isVNode) {
    childFlags = ChildrenFlags.SINGLE_VNODE
  } else {
    childFlags = ChildrenFlags.SINGLE_VNODE
    children = createTextVNode(children + '')
  }
  return {
    _isVNode: true,
    flags,
    tag,
    data,
    children,
    childFlags,
    el: null
  }
}

function normalizeVNodes(children) {
  const newChildren = []
  for(let i = 0; i < children.length; i++) {
    const child = children[i]
    if(child.key === undefined) {
      child.key = '|' + i
    }
    newChildren.push(child)
  }
  return newChildren
}

function createTextVNode(text) {
  return {
    _isVNode: true,
    flags: VNodeFlags.TEXT,
    data: null,
    children: text,
    childFlags: ChildrenFlags.NO_CHILDREN,
    el: null
  }
}

function normalizeClass(classValue) {
  let res = ''
  if(typeof classValue === 'string') {
    res = classValue
  } else if(Array.isArray(classValue)) {
    for(let item of classValue) {
      res += normalizeClass(item) + ' '
    }
  } else if (typeof classValue === 'object') {
    for(let item in classValue) {
      if(classValue[item]) {
        res += item + ' '
      }
    }
  }
  return res.trim()
}