<template>
  <div class="image">
    <h3> <span><i class="el-icon-arrow-left" @click="onClick('-')"></i></span>{{date}}<span><i class="el-icon-arrow-right" @click="onClick('+')"></i></span></h3>
    <div class="width: 100%;"><duno-table :columns="columns" :dataList="dataList" /></div>
  </div>
</template>
<script>
import moment from 'moment'
import dunoTable from '../../alarm/components/Table'
export default {
  name: 'inspection',
  components: {dunoTable},
  data () {
    return {
      date: '',
      columns: [
        {
          title: '设备名称',
          key: 'name',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '观察对象',
          key: 'observe',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '数值/状态',
          key: 'status',
          align: 'center',
          minWidth: 100,
          tooltip: true
        }
      ],
      dataList: [
        {
          name: '#4主变A相本体',
          observe: '开关',
          status: '3'
        },
        {
          name: '#4主变C相本体',
          observe: '开关',
          status: '5'
        },
        {
          name: '#4主变110kV开关',
          info: '仪表',
          status: '48'
        },
          {
              name: '#4主变A相本体',
              observe: '开关',
              status: '3'
          },
          {
              name: '#4主变C相本体',
              observe: '开关',
              status: '5'
          },
          {
              name: '#4主变110kV开关',
              info: '仪表',
              status: '48'
          },
          {
              name: '#4主变A相本体',
              observe: '开关',
              status: '3'
          },
          {
              name: '#4主变C相本体',
              observe: '开关',
              status: '5'
          },
          {
              name: '#4主变110kV开关',
              info: '仪表',
              status: '48'
          },
          {
              name: '#4主变A相本体',
              observe: '开关',
              status: '3'
          },
          {
              name: '#4主变C相本体',
              observe: '开关',
              status: '5'
          },
          {
              name: '#4主变110kV开关',
              info: '仪表',
              status: '48'
          }

      ]
    }
  },
  methods: {
    onClick (type) {
      if (type == '-') {
        this.date = moment(this.date).subtract(1, 'days').format('YYYY-MM-DD');
      } else {
        this.date = moment(this.date).add(1, 'days').format('YYYY-MM-DD');
      }
    }
  },
  mounted () {
    const that = this
    that.date = moment().add(1, 'days').format('YYYY-MM-DD');
  }
}
</script>
<style lang="scss" scoped>
.image {
  width: 80%;
  margin: 0 auto;

  h3 {
    color: #fff;
    text-align: center;

    span {
      margin: 0 1em;
    }
  }
}
</style>
