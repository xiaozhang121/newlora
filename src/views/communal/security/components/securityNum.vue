<template>
  <div class="securityNum">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div>{{title}}</div>
    <div class="number">
      <statistics />
    </div>
    <div class="thRecord">
      <PageHisRecords :titleCode="titleCode" />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import PageHisRecords from "_c/duno-c/PageHisRecords";
import statistics from "_c/duno-j/statistics";
import { getAxiosData } from "@/api/axiosType";
import { mapState } from 'vuex'
export default {
  name: "securityNum",
  components: {
    Breadcrumb,
    PageHisRecords,
    statistics
  },
  props: {
    title: {
      type: String,
      default: "1000千伏安防警告"
    },
    navBar: {
      type: Array,
      default: () => {
        return ["操作中台", "安防监测", "1000千伏"];
      }
    },
    securityRecord: {
      type: String
    }
  },
  data() {
    return {
      dataBread: [],
      titleCode: "",
      deviceList:[],
      areaId:''
    };
  },
  computed:{
    ...mapState([
        'user'
    ]),
    kilovoltKind(){
      return this.$store.state.app.kilovolt
    },
    kilovolt1000Pic(){
        
    },
    kilovolt500Pic(){
        
    },
    kilovolt220Pic(){
        
    },
    kilovolt110Pic(){
        
    },
    kilovolt35Pic(){
        
    },
    kilovolt10Pic(){
        
    }
  },
  methods: {
    getAreaData() {
      getAxiosData("/lenovo-device/api/area/list").then(res => {
        if (res.code !== 200) {
          that.dataList = [];
          that.totalNum = 0;
          return that.$message.error(res.msg);
        }
        let dataList = res.data.dataList;
      });
      // getAxiosData("/lenovo-alarm/api/security/statistics",this.areaId).then(res => {
      //   if (res.code !== 200) {
      //     that.dataList = [];
      //     that.totalNum = 0;
      //     return that.$message.error(res.msg);
      //   }
      
      // });
    }
  },
  mounted() {
    this.dataBread = this.navBar;
    this.titleCode = this.securityRecord;
    this.getAreaData();
  }
};
</script>

<style lang="scss">
.securityNum {
  & > div:nth-child(2) {
    font-size: 22px;
    line-height: 60px;
    color: #ffffff;
  }
  .number {
    // height: 310px;
    padding: 20px;
    background-color: #142838;
    & > div {
      height: 100%;
    }
  }
  .thRecord {
    margin-top: 20px;
  }
}
</style>

