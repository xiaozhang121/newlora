import Main from '@/views/duno-default/main'
import parentView from '@/components/parent-view'
/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hide: (false) 设为true头部面包屑不会显示
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  isDetails: (false) 设置为true后在左侧菜单不会显示，但是在面包屑导航中显示，适用于新增、编辑...之类页面
 *  active: isDetails设置为true后设置该属性可以在新增、编辑页中，默认选中想选中的侧边栏name
 *  notCache: (false) 设为true后页面不会缓存
 *  toListName: (null) 如果有多个children 但是不在菜单显示，在父级添加该变量，变量的值为该路由下的列表的name
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标  使用的是阿里巴巴矢量图标库  https://www.iconfont.cn/home/index?spm=a313x.7781069.1998910419.2
 *  showAlways:当有三级菜单时设为true时只有一个三级菜单一样显示三级菜单内容
 *  btnArr: [] 该页面的按钮都有哪些
 *  isAlone: (false) 设为true后表示独立菜单，在角色分配菜单时不出现重复
 *  isLogin: (true) 设为true表示该页面不需要登录即可访问，不设置或者设置为false表示该页面需要登录才可以访问
 * }
 */

 /* 循环生成文件中的文件夹名称 */
const routerArr = require('@/views/communal/router.json')
const netRouter = {}
for (let i = 0; i < routerArr.length; i++) {
  const router = require('@/views/communal/'+ routerArr[i] + '/router.js').default
  netRouter[routerArr[i]] = router
}

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideMenuAuthority: true,
      hideInMenu: true,
      isLogin: true
    },
    component: () => import('@/views/duno-default/login/login.vue')
  },
/*  {
    path: '/',
    name: '_home',
    redirect: 'home',
    component: Main,
    meta: {
      hide: true,
      isAlone: true,
      title: '首页',
      access: ['100000'],
      notCache: true
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页',
          icon:"icon-shouye",
          access: ['100000'],
          notCache: true,
          isAlone: true
        },
        component: () => import('@/views/duno-default/home/home.vue')
      }
    ]
  },*/
    {
        path: '/realEnv',
        name: '_realEnv',
        redirect: 'realEnv/realEnv/list',
        component: Main,
        meta: {
            notCache: true,
            access: ['200000'],
            title: '实景展示'
        },
        children: [
            {
                path: 'realEnv',
                name: 'realEnvIndex',
                meta: {
                    title: '全图展示',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'realEnvList',
                    btnArr: [{'name': '列表', 'code': '200001_1'}]
                },
                component: parentView,
                children: [
                    {
                        path: 'list',
                        name: 'realEnvList',
                        meta: {
                            access: ['11001010'],
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/realEnv/index.vue'),
                    }
                ]
            }
        ]
    },
    {
      path: '/',
      name: '_alarmInfo',
      component: Main,
      meta: {
        hide: true,
        isAlone: true,
        title: '告警信息',
        notCache: true
      },
      children: [
        {
          path: 'alarm-info',
          name: 'alarmInfo',
          meta: {
            title: '告警信息',
            icon:"icon-shouye",
            notCache: true,
            isAlone: true
          },
          component: () => import('@/views/communal/alarmInfo/index.vue')
        }
      ]
    },
  /* 其他设置 */
  // {
  //   path: '/rests',
  //   name: '_rests',
  //   component: Main,
  //   meta: {
  //     notCache: true,
  //     icon: 'icon-shezhi',
  //     access: ['11000000'],
  //     title: '其他设置'
  //   },
  //   children: [
  //     {
  //       path: 'feedback',
  //       name: 'feedbackIndex',
  //       meta: {
  //         title: '意见反馈',
  //         access: ['11001000'],
  //         notCache: true,
  //         toListName: 'feedbackList',
  //         btnArr: [{'name': '列表', 'code': '11001010'}, {'name': '详情', 'code': '11001020'}, {'name': '删除', 'code': '11001040'}]
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'feedbackList',
  //           meta: {
  //             access: ['11001010'],
  //             title: '列表',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/rests/feedback/index.vue'),
  //         },
  //         {
  //           path: 'view',
  //           name: 'feedbackView',
  //           meta: {
  //             active: 'feedbackList',
  //             access: ['11001020'],
  //             title: '详情',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/rests/feedback/view.vue')
  //         }
  //       ]
  //     }
  //   ]
  // },
  /* 系统设置 */
  // {
  //   path: '/basic',
  //   name:'basic',
  //   component: Main,
  //   meta: {
  //     notCache: true,
  //     icon: 'icon-shezhi1',
  //     access: ['10000000'],
  //     title: '系统设置'
  //   },
  //   children: [
  //     {
  //       path: 'role',
  //       name: 'roleAuthorityIndex',
  //       meta: {
  //         access: ['10001000'],
  //         title: '角色权限',
  //         toListName: 'roleAuthority',
  //         btnArr: [{'name': '列表', 'code': '10001010'},{'name': '新增', 'code': '10001020'}, {'name': '编辑', 'code': '10001030'}, {'name': '删除', 'code': '10001040'}]
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'roleAuthority',
  //           meta: {
  //             access: ['10001010'],
  //             title: '列表',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/role/index.vue'),
  //         },
  //         {
  //           path: 'add',
  //           name: 'roleAuthorityAdd',
  //           meta: {
  //             active: 'roleAuthority',
  //             access: ['10001020'],
  //             title: '新增',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/role/edit.vue')
  //         },
  //         {
  //           path: 'edit',
  //           name: 'roleAuthorityEdit',
  //           meta: {
  //             active: 'roleAuthority',
  //             access: ['10001030'],
  //             title: '编辑',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/role/edit.vue')
  //         }
  //       ]
  //     },
  //     {
  //       path: 'account',
  //       name: 'accountIndex',
  //       meta: {
  //         access: ['10002000'],
  //         title: '账号管理',
  //         toListName: 'accountList',
  //         btnArr: [{'name': '列表', 'code': '10002010'},{'name': '新增', 'code': '10002020'}, {'name': '编辑', 'code': '10002030'}, {'name': '删除', 'code': '10002040'}]
  //       },
  //       component: parentView,
  //       children: [
  //         {
  //           path: 'list',
  //           name: 'accountList',
  //           meta: {
  //             access: ['10002010'],
  //             title: '列表',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/account/index.vue'),
  //         },
  //         {
  //           path: 'add',
  //           name: 'accountListAdd',
  //           meta: {
  //             active: 'accountList',
  //             access: ['10002020'],
  //             title: '新增',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/account/edit.vue')
  //         },
  //         {
  //           path: 'edit',
  //           name: 'accountListEdit',
  //           meta: {
  //             active: 'accountList',
  //             access: ['10002030'],
  //             title: '编辑',
  //             hideInMenu: true,
  //             isDetails: true
  //           },
  //           component: () => import('@/views/duno-default/basic-setting/account/edit.vue')
  //         }
  //       ]
  //     }
  //   ]
  // },
  /* 个人中心 */
  // {
  //   path: '/',
  //   name: '_center',
  //   component: Main,
  //   meta: {
  //     hide: true,
  //     hideInMenu: true,
  //     hideMenuAuthority: true,
  //     isAlone: true,
  //     title: '个人中心'
  //   },
  //   children: [
  //     {
  //       path: 'center',
  //       name: 'memberCenter',
  //       meta: {
  //         title: '个人中心',
  //         btnArr: []
  //       },
  //       component: () => import('@/views/duno-default/memberCenter/index.vue')
  //     }
  //   ]
  // },
  /* 消息中心 */
  // {
  //   path: '/message',
  //   name: '_message',
  //   component: Main,
  //   meta: {
  //     hide: true,
  //     hideInMenu: true,
  //     hideMenuAuthority: true,
  //     title: '消息中心',
  //     btnArr: [{'name': '新增', 'code': '12001020'}, {'name': '删除', 'code': '12001040'}]
  //   },
  //   children: [
  //     {
  //       path: 'list',
  //       name: 'messageList',
  //       meta: {
  //         title: '消息中心'
  //       },
  //       component: () => import('@/views/duno-default/message/index.vue')
  //     },
  //     {
  //       path: 'add',
  //       name: 'messageAdd',
  //       meta: {
  //         access: ['12001020'],
  //         title: '消息新增'
  //       },
  //       component: () => import('@/views/duno-default/message/edit.vue')
  //     }
  //   ]
  // },
  /* 新增意见反馈 */
  // {
  //   path: '/feedback',
  //   name: '_feedback',
  //   component: Main,
  //   meta: {
  //     hide: true,
  //     hideInMenu: true,
  //     hideMenuAuthority: true,
  //     isAlone: true,
  //     title: '意见反馈'
  //   },
  //   children: [
  //     {
  //       path: 'add',
  //       name: 'feedbackAdd',
  //       meta: {
  //         title: '意见反馈',
  //         btnArr: []
  //       },
  //       component: () => import('@/views/duno-default/rests/feedback/add.vue')
  //     }
  //   ]
  // },
  /* 以下为系统出错时访问的路由 */
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideMenuAuthority: true,
      hideInMenu: true
    },
    component: () => import('@/views/duno-default/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideMenuAuthority: true,
      hideInMenu: true
    },
    component: () => import('@/views/duno-default/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideMenuAuthority: true,
      hideInMenu: true
    },
    component: () => import('@/views/duno-default/error-page/404.vue')
  }
]