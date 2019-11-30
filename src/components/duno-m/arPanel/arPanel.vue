<template>
    <div class="arPanel" v-if="visibleOption">
        <el-dialog :model="true" :close-on-click-modal="false"  class="elDialogClass" :visible.sync="visibleOption" width="450px" center @close="handleClose">
            <div slot="title">
                {{ title }}
            </div>
            <el-form label-position="left" :rules="rules" ref="form" :model="form" label-width="100px">
                <el-form-item label="设备组件"  prop="cascaderName">
                    <el-cascader v-model="form.cascaderName" :data="cascaderData" @on-change="handleChange" :load-data="loadData"></el-cascader>
                </el-form-item>
                <el-form-item label="电压区域">
                    <el-select v-model="form.areaId" placeholder="请选择（非必选）">
                        <el-option
                                v-for="(item,index) in diviceData"
                                :label="item.label"
                                :value="item.value"
                                :key="index"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="被监测设备">
                    <el-input v-model.trim="form.powerDeviceName" placeholder="请输入被监测设备名" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <button-custom class="button" @click.native="handleClose" title="取消" />
                    <button-custom class="button" @click.native="handleSubmit" title="确定" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import arPanel from "_c/duno-m/arPanel"
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'arPanel',
    components: {
        buttonCustom,
        arPanel
    },
    data() {
        return {
          diviceData: [
            {
              label: "1000KV",
              value: "0"
            },
            {
              label: "500KV",
              value: "1"
            },
            {
              label: "220KV",
              value: "2"
            },
            {
              label: "110KV",
              value: "3"
            },
            {
              label: "35KV",
              value: "4"
            },
            {
              label: "10KV",
              value: "5"
            }
          ],
          cascaderData: [],
          rules: {
            cascaderName: [
              { required: true, message: '请选择设备组件', trigger: 'change' }
            ],
          },
          form: {
            id: '',
            cascaderName: '',
            areaId: '',
            areaName: '',
            powerDeviceName: ''
          },
          visibleOption: false,
          mainDevice: "",
          part: "",
          partSub: ""
        }
    },
    watch:{
        params:{
          handler(now){
            let id = now['id']
            this.initPanel(id)
          },
          deep: true,
          immediate: true
        },
        visible(now){
            this.visibleOption = now
        },
    },
    props: {
        params: {
            type: Object,
            default: ()=>{
              return {}
            }
        },
        title: {
            type: String,
            default: '修改图片'
        },
        visible:{
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    computed: {

    },
    methods:{
      getMapping(arr, id){
        let label = ''
        arr.forEach(item=>{
          if(item['value'] == id){
            label = item['label']
          }
        })
        return label
      },
      initPanel(id){
        this.form.id = id
        getAxiosData('/lenovo-sample/api/sample/ar/view', {id: id}).then(res=>{
          let data = res.data
          this.mainDevice = data.mainDevice
          this.part = data.part
          this.partSub = data.partSub
          this.form.cascaderName = [data.mainDevice, data.part, data.partSub]
          this.form.areaId = data.areaId.toString()
          this.form.areaName = data.areaName
          this.form.powerDeviceName = data.powerDeviceName
        })
      },
      loadData(item, callback) {
        item.loading = true;
        let index = item.__label.split(" / ").length - 1;
        let url = "";
        let query = {};
        if (index == 0) {
          url = "/lenovo-sample/api/sample/getPart";
          query = {
            mainDevice: item.value
          };
          this.mainDevice = item.value;
        } else {
          url = "/lenovo-sample/api/sample/getPartSub";
          query = {
            mainDevice: this.mainDevice,
            part: item.value
          };
        }
        postAxiosData(url, query).then(res => {
          let data = res.data;
          if (index == 0) {
            data.forEach(el => {
              el.children = [];
              el.loading = false;
            });
          }
          item.children = data;
          item.loading = false;
          callback();
        });
      },
      handleChange(value) {
        this.mainDevice = value[0];
        this.part = value[1];
        this.partSub = value[2];
      },
      getVoltage(){
        let url = "/lenovo-sample/api/sample/getMainDevice";
        postAxiosData(url).then(res => {
          let data = res.data;
          data.forEach(el => {
            el.children = [];
            el.loading = false;
          });
          this.cascaderData = data;
        });
      },
      handleClose(){
        this.visibleOption = false
        this.$emit('on-close')
      },
      handleSubmit(){
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let areaName = this.getMapping(this.diviceData, this.form.areaId)
            this.form.areaName = areaName
            this.form.mainDevice = this.mainDevice
            this.form.part = this.part
            this.form.partSub = this.partSub
            this.$emit('on-submit', this.form)
          } else {
            return false;
          }
        });
      }
    },
    created(){
      this.getVoltage()
    }
}
</script>

<style lang="scss">
    .arPanel{
        .el-form-item--small.el-form-item{
            margin-bottom: 27px;
        }
        .el-select{
            width: 100%;
        }
        .el-dialog__close{
            font-size: 26px;
        }
        .el-dialog--center{
            background: #e0e0e0;
        }
        .el-input--small .el-input__inner{
            /*text-align: center;*/
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            color: #ffffff;
            .button {
                height: 37px;
                line-height: 31px;
                font-size: 14px;
                &:first-child {
                    margin-right: 30px;
                }
            }
        }
        .el-dialog__header{
            font-size: 18px;
            color: #333333;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .el-dialog__headerbtn{
            right: 14px !important;
            top: 19px !important;
        }
        .el-dialog__body{
            margin-top: -15px;
        }
    }
</style>

