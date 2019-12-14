import qs from 'qs'
import { mapState } from 'vuex'
import config from '@/config'
import { swapArray } from '@/libs/util'
import { getAxiosData, deleteDataId, postAxiosData, putAxiosData } from '@/api/axiosType'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
  data () {
    return {
      // 设置属性
      mixinViewModuleOptions: {
        imgAUTO: false,
        activatedIsNeed: false, //  此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '', //  数据列表接口，API地址
        isShowPage: true, // 表格是否分页
        deleteURL: '', //  删除接口，API地址
        deletesURL: '', //  批量删除接口，API地址
        deleteIsBatch: false, //  删除接口，是否需要批量？
        deleteIsBatchKey: 'id', //  删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: '', //  导出Excel接口，API地址
        addURL: '', //  新增接口
        toEditURL: '', //  编辑回显接口
        editURL: '', //  编辑接口
        deptURL: '', //  部门结构
        isDept: false, //  此页面是否在激活（进入）时，调用查询部门接口？
        _disabled: false,
      },
      // 默认属性
      queryForm: {}, //  查询条件
      deptData: [], //  部门列表
      dataList: [], //  数据列表
      orderField: {}, //  排序，字段
      pageIndex: 1, //  当前页码
      pageRows: 10, //  每页数
      totalNum: 0, //  总条数
      dataListLoading: false,     //  数据列表，loading状态
      dataListSelections: [],     //  数据列表，多选项
      addOrUpdateVisible: false,   //  新增／更新，弹窗visible状态
      bianji:require('@/assets/images/btn/bianji.png'),
      chakan:require('@/assets/images/btn/chakan.png'),
      del:require('@/assets/images/btn/del.png'),
      reset:require('@/assets/images/btn/biangeng.png'),
      download:require('@/assets/images/btn/download.png'),
      uploading:require('@/assets/images/btn/uploading.png'),
      kilovolt10:require('@/assets/SVG/kilovolt10.svg'),
      kilovolt35:require('@/assets/SVG/kilovolt35.svg'),
      kilovolt110:require('@/assets/SVG/kilovolt110.svg'),
      kilovolt220:require('@/assets/SVG/kilovolt220.svg'),
      kilovolt500:require('@/assets/SVG/kilovolt500.svg'),
      kilovolt1000:require('@/assets/SVG/kilovolt1000.svg'),
      kilovoltAllAround:require('@/assets/SVG/kilovoltAllAround.svg'),
      Allkv:require('@/assets/realViewImg/AllkvD.png'),
      kv1000:require('@/assets/realViewImg/kv1000.png'),
      kv500:require('@/assets/realViewImg/kv500.png'),
      kv220:require('@/assets/realViewImg/kv220.png'),
      kv110:require('@/assets/realViewImg/kv110.png'),
      kv35:require('@/assets/realViewImg/kv35.png'),
      toward: require('@/assets/images/toward.png'),
      towardAround: require('@/assets/images/towardAround.png'),
      ARGlass: require('@/assets/buttonPng/ARGlass.png'),
      controlBall: require('@/assets/buttonPng/controlBall.png'),
      handRed: require('@/assets/buttonPng/handRed.png'),
      intelLock: require('@/assets/buttonPng/intelLock.png'),
      lightD: require('@/assets/buttonPng/lightD.png'),
      redLight: require('@/assets/buttonPng/redLight.png'),
      redLightCamera: require('@/assets/buttonPng/redLightNCamera.png'),
      robot: require('@/assets/buttonPng/robot.png'),
      light: require('@/assets/buttonPng/lightCamera.png'),
      lightNoCamera: require('@/assets/buttonPng/light.svg'),
      weatherCheck: require('@/assets/SVG/weatherCheck.svg'),
      switchPic: require('@/assets/runDevice/switch.png'),
      AP: require('@/assets/runDevice/AP.png'),
      pad: require('@/assets/runDevice/pad.png'),
      ball: require('@/assets/runDevice/ball.png'),
      waterBox: require('@/assets/runDevice/waterBox.png'),
      ballJ: require('@/assets/runDevice/ballJ.png'),
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    /*
    * 获取列表页表格数据
    * */
    getDataList () {
      const that = this
      this.dataListSelections = []
      that.dataListLoading = true
      const url = that.mixinViewModuleOptions.getDataListURL
      const query = {
        ...that.dataForm,
        ...that.queryForm,
        ...that.orderField
      }
      that.mixinViewModuleOptions.isShowPage = false
      // if (that.mixinViewModuleOptions.isShowPage) {
        query.pageIndex = that.pageIndex
        query.pageRows = that.pageRows
      // }
      getAxiosData(url, query).then(res => {
        that.dataListLoading = false
        if (res.code !== 200 && res.data.code != 200 && !('details' in res.data)) {
          that.dataList = []
          that.totalNum = 0
          return that.$message.error(res.msg)
        }
        let data = res.data.details || res.data.records  || res.data.data || res.data.tableData || res.data.dutyData || res.data.todayData || res.data.monthData || res.data
        data.map((item, index)=>{
          item['_keyIndex'] = index + 1
          if(that.mixinViewModuleOptions._disabled && item['isImport'] == 1){
            item['_disabled'] = true
          }
        })
        that.dataList = data
        if(that.mixinViewModuleOptions.imgAUTO){
          data.forEach((item, index) => {
            postAxiosData("/lenovo-alarm/api/info/video/pic", {
              videoPath: item["alarmFileAddress"],
              positionIndex: index
            }).then(res => {
              that.tableList[res.data["positionIndex"]]["pic"] = res.data.pic;
              that.$forceUpdate();
            });
          })
        }
        if('details' in res.data && res.data['details'] == null){
            that.dataList = []
            that.$forceUpdate()
        }
        if(that.dataList.length==0){
          that.mixinViewModuleOptions.isShowPage = false
        }else{
          that.mixinViewModuleOptions.isShowPage = true
        }
        if (that.mixinViewModuleOptions.isShowPage) {
            that.totalNum = Number(res.data.total) || Number(res.data.pageParam.totalRows)
        }
        that.$forceUpdate()
      }, error => {
        that.dataListLoading = false
        // console.log(error)
      })
    },
    /*
    * 列表页点击查询按钮功能
    * 参数：
    *   val：查询携带的参数
    *
    *   注意：
    *     1、查询时参数
    * */
    clickQuery (val) {
      const that = this
      const newObj = {}
      const newVal = JSON.parse(JSON.stringify(val))
      that.mixinViewModuleOptions.isShowPage = true
      for (let key in this.dataForm) {
        newObj[key] = this.dataForm[key]
      }
      for (let key in newVal) {
        newObj[key] = newVal[key]
      }
      that.queryForm = { ...newObj }
      that.pageIndex = 1
      that.getDataList()
    },
    /*
    * 表格多选功能
    * 参数：
    *   val：勾选中的数组（该数组为选中项的id）
    * */
    dataListSelectionChangeHandle (val) {
      const newArr = []
      for (let i = 0; i < val.length; i++) {
        newArr.push(val[i].id)
      }
      this.dataListSelections = newArr
    },
    /*
    * 表格表头排序功能
    * 参数：
    *   column：（object）排序的方式，倒序/升序
    * */
    dataListSortChangeHandle (column, key, order) {
      if (!column.order || !column.key) {
        this.orderField = {}
        return false
      }
      this.orderField['order__' + column.key] = column.order
      this.getDataList()
    },
    /*
    * 切换表格时每页多少条数据的功能
    * 参数：
    *     val：当前选中每页多少条数据，选中以后页码从第一页开始查询
    * */
    pageSizeChangeHandle (val) {
      this.pageIndex = 1
      this.pageRows = val
      this.getDataList()
    },
    /*
    * 点击分页按钮
    * 参数：
    *     val：当前选择的页码数
    * */
    pageCurrentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    /*
    * 点击新增 / 修改跳转的页面
    * 参数：
    *     name：跳转路由的name
    *     id：编辑时的唯一标识，提供给编辑回显时使用
    * */
    addOrUpdateHandle (name, id) {
      const query = { id: id }
      this.$router.push({ name: name, query: query })
    },
    /*
    * 新增功能
    * */
    postAdd (fn, newQuery) {
      const that = this
      that.dataListLoading = true
      const url = that.mixinViewModuleOptions.addURL
      let query = {}
      if (!newQuery) {
        for (let key in that.formData) {
          query[key] = that.formData[key]
        }
      } else {
        query = {...newQuery}
      }
      postAxiosData(url, query).then(res => {
        that.dataListLoading = false
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        if (fn) {
          fn()
        } else {
          that.$router.go(-1)
        }
      }, error => {
        that.dataListLoading = false
        // console.log('新增失败：', error)
      })
    },
    /*
    * 保存编辑功能
    * that.mixinViewModuleOptions.editURL：编辑的请求url地址
    * 参数：fn为编辑成功以后的自定义方法，改方法可以为空
    * */
    postEdit (fn, newQuery) {
      const that = this
      that.dataListLoading = true
      const url = that.mixinViewModuleOptions.editURL
      let query = {}
      if (!newQuery) {
        query.id = that.query.id
        for (let key in that.formData) {
          query[key] = that.formData[key]
        }
      } else {
        query = {...newQuery}
      }
      putAxiosData(url, query).then(res => {
        that.dataListLoading = false
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        if (fn) {
          fn()
        }
      }, error => {
        that.dataListLoading = false
        // console.log('编辑失败：', error)
      })
    },
    /*
    * 编辑回显方法
    * that.mixinViewModuleOptions.toEditURL：编辑回显的请求url地址
    * */
    toEdit (fn, newQuery) {
      const that = this
      const url = that.mixinViewModuleOptions.toEditURL
      let query = {}
      if (!newQuery) {
        query = { id: that.query.id }
      } else {
        query = { ...newQuery }
      }
      getAxiosData(url, query).then(res => {
        if (res.code === 200) {
          let formData = res.data
          for (let key in formData) {
            try {
              if (formData[key].indexOf('[{') === 0) {
                formData[key] = JSON.parse(formData[key])
              }
            } catch (e) {}
          }
          if (fn) {
            fn(formData)
          } else {
            that.formData = formData
          }
        }
      })
    },
    /*
    * 删除功能
    *   参数id为字符串
    *   that.mixinViewModuleOptions.deleteIsBatch 该值为true时，并且参数id为null表示为批量删除
    * */
    deleteHandle (id) {
      const that = this
      const query = {}
      let url = ''
      if (that.mixinViewModuleOptions.deleteIsBatch && !id && that.dataListSelections.length <= 0) {
        return this.$message.warning({
          message: '请选择删除项',
          duration: 5000
        })
      }
      if (that.mixinViewModuleOptions.deleteIsBatch && !id) {
        url = that.mixinViewModuleOptions.deletesURL
        query.ids = that.dataListSelections.join(',')
      } else {
        url = this.mixinViewModuleOptions.deleteURL
        query.id = id
      }
      deleteDataId(url, query).then(res => {
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        that.getDataList()
      })
    },
    /*
    * 账号管理-重置密码
    * 参数：
    *   id：需要重置密码的账号id
    * */
    resetPassword (id) {
      const that = this
      const query = { userId: id }
      let url = '/venus/user/password/reset'
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
      })
    },
    /*
    * 导出功能
    *   baseUrl：为服务器前缀
    *   this.mixinViewModuleOptions.exportURL：导出Excel的url地址
    *   params：导出携带的参数
    *   url: 文件完整路径,该参数主要用于文件下载
    * */
    exportHandle (url) {
      if (!url) {
        let params = qs.stringify({
          't': this.user.token,
          ...this.queryForm
        })
        let url = `${baseUrl}${this.mixinViewModuleOptions.exportURL}?${params}`
        window.open(url,"_blank");
        // window.location.href = `${baseUrl}${this.mixinViewModuleOptions.exportURL}?${params}`
      } else {
          window.open(url,"_blank");
        // window.location.href = url
      }
    },
    /*
    * 获取部门列表方法
    * that.mixinViewModuleOptions.deptURL 获取部门列表的url地址
    * */
    getDeptData () {
      const that = this
      const url = that.mixinViewModuleOptions.deptURL
      that.dataListLoading = true
      getAxiosData(url).then(res => {
        that.dataListLoading = false
        if (res.code !== 200) {
          that.deptData = []
          return that.$message.error(res.msg)
        }
        that.deptData = res.data
      }, error => {
        that.dataListLoading = false
        // console.log(error)
      })
    },
    /*
    * 获取该用户是否有指定按钮的权限
    * 参数：
    *   id：权限码的编号
    * */
    getAuthority (id) {
      const access = JSON.parse(JSON.stringify(this.user.access))
      let falg = false
      for (let i = 0; i < access.length; i++) {
        if (access[i] === id) {
          falg = true
          break
        }
      }
      return falg
    },
    /*
    * 表格内上下移动交换行位置功能
    * 参数：id号， 是否为下移， 当前列数据， 根据那个字段排序, 请求路径标识
    * */
    tablesMove (id, isDown, row, rank, reportId) {
      let that = this
      if (row._index === 0 && !isDown) {
        that.$message.warning('已经处于置顶,不能上移')
        return false
      }
      if (row._index === (that.dataList.length - 1) && isDown) {
        that.$message.warning('已经处于底部,不能下移')
        return false
      }
      let index = isDown ? (row._index + 1) : (row._index - 1)
      let arr = JSON.parse(JSON.stringify(that.dataList))
      let oneNo = that.dataList[index][rank]
      let twoNo = that.dataList[row._index][rank]
      let postArr = [{ id: id, sortNo: oneNo, sortName: rank }, { id: that.dataList[index].id, sortNo: twoNo, sortName: rank }]
      that.moveNum(postArr, reportId)
      arr[index][rank] = twoNo
      arr[row._index][rank] = oneNo
      that.dataList = swapArray(arr, row._index, index)
    },
    /*
    * 表格上下移动后发起请求，告诉服务器数据发生变化
    * */
    moveNum (data, reportId) {
      let url = `/venus/crud/${reportId}/sort`
      let query = data
      postAxiosData(url, query).then(res => {
        // console.log(res.data)
      })
    }
  },
  mounted () {
    const that = this
    that.$nextTick(() => {
      /*
      * 列表页加载到页面是否调用获取列表数据
      * */
      if (that.mixinViewModuleOptions.activatedIsNeed && that.mixinViewModuleOptions.getDataListURL) {
        that.getDataList()
      }
      /*
      * 是否调用获取部门数据
      * */
      if (that.mixinViewModuleOptions.isDept && that.mixinViewModuleOptions.deptURL) {
        that.getDeptData()
      }
    })
  }
}
