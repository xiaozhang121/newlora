export default {
  props: {
    parentItem: {
      type: Object,
      default: () => {}
    },
    theme: String,
    iconSize: Number
  },
  computed: {
    parentName () {
      return this.parentItem.name
    },
    children () {
      let children = JSON.parse(JSON.stringify(this.parentItem.children))
      for (let i = 0; i < children.length; i++) {
        if (children[i].meta && children[i].meta.toListName) {
          children[i].name = children[i].meta.toListName
        }
      }
      return children
    },
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060'
    }
  }
}
