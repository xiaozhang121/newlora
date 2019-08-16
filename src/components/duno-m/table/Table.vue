<template>
  <div class="duno-table">
    <div>
      <duno-tables-tep
        :columns="columns"
        :data="dataList"
        :totalNum="dataList.length"
        :border="false"
        :height="height"
        :showSizer="true"
        :isShowPage="false"
      />
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from '_c/duno-tables-tep'
import moment from 'moment'
export default {
  name: 'alarmTable',
  components: { DunoTablesTep },
  data () {
    return {
      value: '',
      input: ''
    }
  },
  computed:{
      getDateTime(){
          const that = this
          const date = new Date()
          let time = moment(date).format('YYYY.MM.DD HH:mm:ss')
          return time
      }
  },
  props: {
    height:{},
    noBottom: {},
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    totalNum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    optionsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods:{
      onClose(){
          this.$emit('on-close')
      }
  }
}
</script>
<style lang="scss">
  @import "@/style/tableStyle.scss";
</style>
<style lang="scss" scoped>

</style>
