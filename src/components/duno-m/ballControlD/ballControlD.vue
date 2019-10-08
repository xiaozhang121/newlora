<template>
    <div class="ballControlD">
        <el-dialog
                title="标定布控球设备"
                v-dialogDrag
                :modal="false"
                :close-on-click-modal="false"
                :visible.sync="dialogVisible"
                width="500px"
                :before-close="handleClose">
            <div class="contain">
                <ul>
                    <li v-for="(item, index) in deviceList" :key="index" :class="{'grey': index % 2 == 0}">
                        <div><span class="circle" :class="[{'active':item['status'] == 1}, {'inactive': item['status'] == 0}]"></span>{{ item['name'] }}</div>
                        <div>{{ item['chosenName'] }}</div>
                        <div><i class="iconfont icon-weibiaoti-" v-if="item['status'] == 1"></i><i class="iconfont icon-xiugaibiaoding" v-else></i><span>{{ item['status'] }}</span></div>
                    </li>
                </ul>
            </div>
        </el-dialog>
        <div  v-show="commitDefineVisible">
        <el-dialog
                title="确定标定位置"
                v-dialogDrag
                :close-on-click-modal="false"
                :visible.sync="commitDefineVisible"
                width="500px"
                :before-close="closeCommit">
            <div class="commit_contain" v-show="commitDefineVisible">
                <div class="info">是否将布控球01标定于此处</div>
                <div class="btnList">
                    <button-custom class="btn" title="重新标定"/>
                    <button-custom  class="btn" title="确定"/>
                </div>
            </div>
        </el-dialog>
        </div>
    </div>
</template>

<script>
  import buttonCustom from '_c/duno-m/buttonCustom'
  export default {
        name: 'ballControlD',
        components: {
            buttonCustom
        },
        data() {
            return {
                dialogVisible: false,
                commitDefineVisible: true,
                deviceList: [
                    {name: '布控球设备名称1', chosenName: '未标定', status: 1},
                    {name: '布控球设备名称1', chosenName: '已标定', status: 0},
                    {name: '布控球设备名称1', chosenName: '已标定', status: 0},
                ]
            }
        },
        computed:{

        },
        watch: {
            visible:{
                handler(now){
                    this.dialogVisible = now
                },
                immediate: true
            }
        },
        props: {
            visible:{
                type: Boolean,
                default: ()=>{
                    return false
                }
            }
        },
        methods:{
            closeCommit(){
              this.commitDefineVisible = false
            },
            handleClose(){
                this.$emit('on-close')
            }
        },
        created(){
            const that = this
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
  .ballControlD{
      .el-dialog__header{
          text-align: center;
      }
      .el-dialog{
          margin-top: inherit !important;
          background: #e0e0e0;
      }
      .el-dialog__wrapper{
          overflow: visible;
          width: 500px;
          height: 227px;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
      }
      .contain{
            & > ul{
                li{
                    display: flex;
                    padding: 0 17px;
                    .circle{
                        background: grey;
                        width: 13px;
                        height: 13px;
                        border-radius: 50%;
                        margin-right: 10px;
                        position: relative;
                        top: -1px;
                        &.active{
                            background: #009861;
                        }
                        &.inactive{
                            background: #ee183b;
                        }
                    }
                    div{
                        flex: 1;
                        justify-content: flex-start;
                        display: flex;
                        align-items: center;
                        line-height: 38px;
                        &:first-child{
                            flex-basis: 118px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            overflow: hidden;
                        }
                        &:last-child{
                            justify-content: flex-end;
                            cursor: pointer;
                            i{
                                margin-right: 10px;
                            }
                        }
                    }
                    &.grey{
                        background: #c7c7c7;
                    }
                }
            }
      }
      .commit_contain{
          .info{
              text-align: center;
              font-size: 15px;
          }
          .btnList{
              display: flex;
              padding: 0 91px;
              margin-top: 54px;
              .btn{
                  color: white;
                  flex: 1;
                  line-height: 33px;
                  &:first-child{
                      margin-right: 37px;
                  }
              }
          }
      }
  }
</style>
