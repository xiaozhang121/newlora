<template>
  <div class="duno-alarm">
    <!--<img :src="all" alt="">-->
    <div class="duno-box">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="8" v-for="(item, index) in dataList" :key="index">
          <div class="duno-elCol">
            <div><duno-table :title="item.title" :columns="columns" :dataList="item.dataList" :optionsList="optionsList" /></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import dunoTable from './components/Table'
export default {
  name: 'dunoAlarm',
  components: { dunoTable },
  data () {
    return {
      all: require('@/assets/images/map/all.png'),
      columns: [
        {
          title: '时间',
          key: 'time',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '设备名称',
          key: 'name',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '告警信息',
          key: 'info',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '处理',
          key: 'deal',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
      ],
      optionsList: [
        {
          value: '1',
          label: '仪表'
        },
        {
          value: '2',
          label: '开关'
        },
        {
          value: '3',
          label: '外观'
        }
      ],
      dataList: [
        {
          title: '1000千伏',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        },
        {
          title: '500千伏',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        },
        {
          title: '220千伏',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        },
        {
          title: '110千伏',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        },
        {
          title: '35千伏',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        },
        {
          title: '站用变',
          dataList: [
            {
              time: '15秒前',
              name: '#4主变A相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '30秒前',
              name: '#4主变C相本体',
              info: '开关',
              deal: '查看'
            },
            {
              time: '1分钟前',
              name: '#4主变110kV开关',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '2小时前',
              name: '#4主变110kV刀闸',
              info: '仪表',
              deal: '查看'
            },
            {
              time: '3小时前',
              name: 'T1电容器地刀',
              info: '外观',
              deal: '查看'
            }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.duno {
  &-alarm {
    width: 100%;
    height: 100%;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }
  &-box {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &-elCol {
    width: 100%;
    height: 0;
    padding-bottom: 86%;
    margin-bottom: 20px;
    position: relative;
    >div {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
}
</style>
