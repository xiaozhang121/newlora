import { initConfigure, login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken } from '@/libs/util'
import avatorImg from '@/assets/images/avatar.jpg'
export default {
  state: {
    configInfo: {},
    isCollapsed: false,  // 侧边栏是否收起
    isSimple: true,
    userName: '',
    userId: '',
    avatorImgPath: '',
    account: '',
    userinfo: {},
    token: getToken(),
    access: [],
    msgNum: 0, // webSocket 中监听当前账号未读消息数
    isFormWidthTop: false // from表单中的label是否切换至top
  },
  mutations: {
    setconfigInfo(state, configinfo){
        state.configInfo = configinfo
    },
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setAccount (state, accountPath) {
      state.account = accountPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setUserinfo (state, userinfo) {
      state.userinfo = userinfo
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password, code, uuid }) {
      userName = userName.trim()
      // console.log('设置token')
      return new Promise((resolve, reject) => {
        const query = { 'userName': userName, 'password': password, 'code': code, 'uuid': uuid }
        login(query).then(res => {
          if (res.code === 200) {
            commit('setToken', res.data.accessToken)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('setToken', '')
          commit('setAccess', [])
          sessionStorage.clear()
          resolve()
        }).catch(err => {
          reject(err)
        })
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      })
    },
    // 初始化配置
    setConfigure ({ state, commit }) {
        return new Promise((resolve, reject) => {
            initConfigure({userId:state.userId, type: '1'}).then(res => {
                console.log('获取配置信息', res.data)
                const data = res.data
                commit('setconfigInfo', data)
                resolve(data)
            }).catch(err => {
                reject(err)
            })
        })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          // console.log('获取用户信息', res.data)
          const data = res.data
          let avator = data.avator ? data.avator : avatorImg
          commit('setAvator', avator)
          commit('setUserName', data.user_name)
          commit('setUserId', data.userId)
          commit('setAccess', data.access)
          commit('setAccount', data.account)
          commit('setUserinfo', data)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}
