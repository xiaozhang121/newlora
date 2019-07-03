<template>
  <div class="image">
    <h3>设备每日记录表 2019-05-30 08:00:00 至 2019-05-31 08:00:00</h3>
    <div class="width: 100%;"><duno-table :columns="columns" :dataList="dataList" /></div>
  </div>
</template>
<script>
import dunoTable from '../../alarm/components/Table'
export default {
  name: 'inspection',
  components: {dunoTable},
  data () {
    return {
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
          info: '开关',
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
              info: '开关',
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
              info: '开关',
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
              info: '开关',
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
  mounted () {
    const that = this
  }
}
</script>
<style lang="scss" scoped>
.image {
  width: 80%;
  margin: 0 auto;
  h3 {
    color: #fff;
  }
}
</style>
