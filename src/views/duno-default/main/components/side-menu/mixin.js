import icons from '_c/icons'
export default {
  components: {
    icons
  },
  methods: {
    showTitle (item) {
      const title = this.$config.useI18n ? this.$t(item.name) : ((item.meta && item.meta.title) || item.name)
      return title
    },
    showChildren (item) {
      const falg = item.children && ((item.children.length > 0 && item.name !== '_home' && item.name !== 'home') || (item.meta && item.meta.showAlways))
      return falg
    },
    getNameOrHref (item, children0) {
      const name = item.href
      ? `isTurnByHref_${item.href}`
      : (
          children0
          ? (
              item.children.length
              ? (
                  item.children[0].meta.active
                  ? item.children[0].meta.active
                  : (
                      item.children[0].meta && item.children[0].meta.toListName
                      ? item.children[0].meta.toListName
                      : item.children[0].name
                    )
                )
              : (
                  item.meta && item.meta.toListName
                  ? item.meta.toListName
                  : item.name
                )
            )
          : (
              item.meta.active
              ? item.meta.active
              : (
                  item.meta && item.meta.toListName
                  ? item.meta.toListName : item.name
                )
            )
        )
      return name
    }
  }
}