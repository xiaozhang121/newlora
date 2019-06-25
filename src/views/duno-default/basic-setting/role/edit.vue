<template>
  <el-card>
    <form-tep ref="formData" :model="formData" label-width="110px" @onSubmit="onFormSubmit">
      <input-tep
        label="角色名称"
        prop="roleName"
        :initialValue="formData.roleName"
        placeholder="请输入"
        :rules="{required: true, message: '请输入角色名称', trigger: 'blur'}"
        @onChange="onChange"
      />

      <input-tep
        label="备注"
        prop="remark"
        type="textarea"
        :initialValue="formData.remark"
        @onChange="onChange"
        placeholder="请输入备注"
        :autosize="{minRows: 2, maxRows: 5}"
      />

      <el-row>
        <el-col :span="12">
          <el-form-item label="菜单授权" prop="accreditList">
            <el-row>
              <el-col :span="23">
                <el-tree ref="menuListTree"
                 :check-strictly="true"
                 :data="menuList"
                 show-checkbox
                 accordion node-key="id"
                 :default-checked-keys="formData.permissionList"
                 :props="defaultProps" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据授权" prop="accreditList">
            <el-row>
              <el-col :span="23">
                <el-tree ref="menuListTrees"
                   :check-strictly="true"
                   :data="deptData"
                   show-checkbox
                   accordion node-key="id"
                   :default-checked-keys="formData.deptList"
                   :props="defaultProps" />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="modalBtn">
        <!-- 
          调用fromTep组件中的onSubmit函数，用来触发表单验证，验证通过以后调用formTep组件上的onSubmit参数（函数）
          注意$refs.formData  这里的formData 是本组件上的ref，否则会调用不成功
        -->
        <el-button type="primary" @click="$refs.formData.onSubmit()" :loading="dataListLoading">确定</el-button>
        <el-button @click="$router.go(-1)" style="margin-left: 8px" :disabled="dataListLoading">返回</el-button>
      </el-form-item>
    </form-tep>
  </el-card>
</template>

<script>
import { FormTep, InputTep } from '_c/Form'
import routes from '@/router/routers'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  name: 'editRole',
  components: { FormTep, InputTep },
  data () {
    return {
      mixinViewModuleOptions: {
        addURL: '/venus/crud/SysRole/add', //  新增接口
        toEditURL: '/venus/crud/SysRole/toEdit', //  编辑回显接口
        editURL: '/venus/crud/SysRole/edit', //  编辑接口
        deptURL: '/venus/role/dept', //  部门结构
        isDept: true //  部门结构
      },
      formData: {
        roleName: '',
        remark: '',
        role: '',
        deptList: [],
        permissionList: ['100000']
      },
      
      menuList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tempKey: -666666, // 临时key, 用于解决tree半选中状态项不能传给后台接口问题.
      query: {},
      title: ''
    }
  },
  created () { // vue生命周期--创建完毕状态
    this.routerFn(routes, this.menuList) // 循环router获取菜单
  },
  computed: {},
  methods: {
    init () {
      this.query = { ...this.$route.query }
      if (this.query.id) {
        this.title = '编辑'
        this.toEdit()
      } else {
        this.title = '新增'
      }
    },
    onChange (data) {
      this.formData[data.name] = data.value
      /* 值发生变化调用from组件的中的单个元素验证 */
      this.$refs.formData.$refs.formTep.validateField(data.name)
    },
    onFormSubmit () {
      const that = this
      that.formData['permissionList'] = [
        ...that.$refs.menuListTree.getCheckedKeys() // ,
        // ...[that.tempKey],
        // ...that.$refs.menuListTree.getHalfCheckedKeys()
      ]
      that.formData['deptList'] = [
        ...that.$refs.menuListTrees.getCheckedKeys() // ,
        // ...[that.tempKey],
        // ...that.$refs.menuListTrees.getHalfCheckedKeys()
      ]
      // console.log(that.formData)
      if (that.query.id) {
        that.postEdit()
      } else {
        that.postAdd()
      }
    },
    routerFn (arr, children) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].meta && arr[i].meta.title && arr[i].meta.title == '消息中心' && arr[i].meta.hideMenuAuthority) {
          let newObj = {
            label: arr[i].meta.title,
            id: arr[i].name + 'Index',
            children: []
          }
          for (let item in arr[i].meta.btnArr) {
            newObj.children.push(
              {
                label: arr[i].meta.btnArr[item].name,
                id: arr[i].meta.btnArr[item].code
              }
            )
          }
          children.push(newObj)
        }
        if (arr[i].meta && !(arr[i].meta.hideMenuAuthority)) {
          let newObj = {
            label: arr[i].meta.title,
            id: arr[i].meta.access[0]
          }
          if (arr[i].meta && arr[i].meta.btnArr && arr[i].meta.btnArr.length) {
            newObj['children'] = []
            this.routerFn(arr[i].meta.btnArr, newObj['children'])
          }
          if (arr[i].children && arr[i].children.length && !(arr[i].meta.isAlone) && !(arr[i].meta.toListName)) {
            newObj['children'] = []
            const childrenArr = arr[i].children
            if (childrenArr.length) {
              this.routerFn(childrenArr, newObj['children'])
            }
          }
          // 首页
          if (arr[i].children && arr[i].children.length === 1 && arr[i].meta.isAlone && !(arr[i].meta.toListName)) {
            newObj['label'] = arr[i].children[0].meta.title
            newObj['id'] = arr[i].children[0].meta.access[0]
            if (newObj.id == '100000') {
              newObj['disabled'] = true
            }
            if (arr[i].children[0].meta.btnArr && arr[i].children[0].meta.btnArr.length) {
              newObj['children'] = []
              this.routerFn(arr[i].children[0].meta.btnArr, newObj['children'])
            }
          }
          children.push(newObj)
        }
        if (arr[i].name && arr[i].code) {
          let newObj = {
            label: arr[i].name,
            id: arr[i].code
          }
          children.push(newObj)
        }
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
