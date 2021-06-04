import h from './h'
function MyFunctionalComponent() {
  return (
    h(
      'div',
      {
        style: {
          backgrount: 'blue'
        }
      },
      [
        h('p', null, '我是函数式组件中的一段话'),
        h('p', null, '我是函数式组件中的一段话')
      ]
    )
  )
}
export default MyFunctionalComponent