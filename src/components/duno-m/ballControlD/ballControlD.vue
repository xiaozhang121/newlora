<template>
    <div class="ballControlD">
        <el-dialog
                v-show="dialogVisible"
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
                        <div><span class="circle" :class="[{'active':item['isConnected'] == 1}, {'inactive': item['isConnected'] == 0}]"></span>{{ item['name'] }}</div>
                        <div>{{ item['chosenName'] }}</div>
                        <div @click="posUpdate(item['monitorDeviceId'], item['name'])" v-if="item['status'] == 1"><span><i class="iconfont icon-xiugaibiaoding" ></i>{{ item['editName'] }}</span></div>
                        <div @click="posUpdate(item['monitorDeviceId'], item['name'])" v-else><i class="iconfont icon-weibiaoti-" ></i><span>{{ item['editName'] }}</span></div>
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
                <div class="info">是否将{{ deviceName }}标定于此处</div>
                <div class="btnList">
                    <button-custom class="btn" title="重新标定" @click.native="rePoint()"/>
                    <button-custom  class="btn" title="确定" @click.native="toSave()"/>
                </div>
            </div>
        </el-dialog>
        </div>
    </div>
</template>

<script>
  import buttonCustom from '_c/duno-m/buttonCustom'
  import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
  export default {
        name: 'ballControlD',
        components: {
            buttonCustom
        },
        data() {
            return {
                deviceName: '',
                dialogVisible: false,
                commitDefineVisible: false,
                deviceList: [
                /*    {name: '布控球设备名称1', chosenName: '未标定', status: 1},
                    {name: '布控球设备名称1', chosenName: '已标定', status: 0},
                    {name: '布控球设备名称1', chosenName: '已标定', status: 0},*/
                ]
            }
        },
        computed:{

        },
        watch: {
            dialogVisible(now){
                this.$parent.$refs.gisMapObj.setPosition(this.$parent.selectBallControl, this.$store.state.user.mapX, this.$store.state.user.mapY)
                this.initTable()
            },
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
            findDevice(){

            },
            rePoint(){
                this.$parent.$refs.gisMapObj.setPosition(this.$parent.selectBallControl, '', '')
                this.commitDefineVisible = false
            },
            toSave(){
                let pos = this.$parent.$refs.gisMapObj.clickPos
                this.$store.state.user.mapX =  pos[0]
                this.$store.state.user.mapY =  pos[1]
                postAxiosData('/lenovo-device/api/monitor/ball-control/location', {monitorDeviceId: this.monitorDeviceId, cadX: pos[0], cadY: pos[1]}).then(res=>{
                    if(res.data.isSuccess){
                        this.$message.success('保存成功')
                    }else{
                        this.$message.fail('保存失败')
                    }
                    this.commitDefineVisible = false
                    this.dialogVisible = true
                    this.$emit('on-reset')
                })
            },
            posUpdate(monitorDeviceId, name){
                this.dialogVisible = false
                this.deviceName = name
                this.monitorDeviceId = monitorDeviceId
                this.$emit('on-draw', monitorDeviceId)
            },
            initTable(){
                getAxiosData('/lenovo-device/api/monitor/ball-control/status',{pageIndex: 1, pageRows: 999999}).then(res=>{
                    let data = res.data.tableData
                    data.map(item=>{
                        // item['isConnected'] = item['isConnected']
                        item['isConnected'] = '1'
                        item['name'] = item['monitorDeviceName']
                        item['chosenName'] = (item['isMark'] == 0)?'未标定':'已标定'
                        item['editName'] = (item['isMark'] == 0)?'标定':'修改'
                        item['status'] = item['isMark']
                    })
                    this.deviceList = data
                })
            },
            closeCommit(){
                this.commitDefineVisible = false
                this.dialogVisible = true
                this.$parent.$refs.gisMapObj.setPosition(this.$parent.selectBallControl, '', '')
                this.$parent.resetM()
            },
            handleClose(){
                this.$emit('on-close')
            }
        },
        created(){
            const that = this
            that.initTable()
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
          width: 0;
          height: 0;
          overflow: visible;
          left: 50%;
          top: 34%;
          transform: translateX(-50%) translateY(-50%);
          margin-left: -252px;
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
