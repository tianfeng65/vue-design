import h from "./h";

class MyClassComponent {
  render () {
    return h(
      'div',
      {
        style: {
          background: 'pink',
        }
      },
      [
        h('p', null, '嘻嘻嘻嘻嘻😁'),
        h('p', null, 'hahahhaha😄')
      ]
    )
  }
}
export default MyClassComponent