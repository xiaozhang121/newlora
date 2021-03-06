import { getFormat, getTopNav, getBreadCrumbList, setTagNavListInLocalstorage, getMenuByRouter, getTagNavListFromLocalstorage, getHomeRoute, routeHasExist } from '@/libs/util'
import routers from '@/router/routers'
export default {
  state: {
    rtmpUrl: null,
    isPic: false,
    picSrc:'',
    monitorInfo: '',
    webFullVisable: false,
    webFull: '',
    rebotFresh: '',
    breadCrumbList: [],
    tagNavList: [],
    isPush: false,
    pushData: '',
    homeRoute: getHomeRoute(routers),
    local: '',
    kilovolt: '',
    routerPaths: [],
    topNav: getTopNav(),
    format: getFormat()
  },
  getters: {
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access)
  },
  mutations: {
    setBreadCrumb (state, routeMetched) {
      state.breadCrumbList = getBreadCrumbList(routeMetched, state.homeRoute)
    },
    saveRouter(state, list){
      if(window.screen.availWidth > 3000)
        state.routerPaths.push(list)
    },
    setTagNavList (state, list) {
      if (list) {
        state.tagNavList = [...list]
        setTagNavListInLocalstorage([...list])
      } else state.tagNavList = getTagNavListFromLocalstorage()
    },
    addTag (state, { route, type = 'unshift' }) {
      if (!routeHasExist(state.tagNavList, route)) {
        if (type === 'push') state.tagNavList.push(route)
        else {
          if (route.name === 'home') state.tagNavList.unshift(route)
          else state.tagNavList.splice(1, 0, route)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    }
  }
}
