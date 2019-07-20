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
    const router = require('@/views/communal/' + routerArr[i] + '/router.js').default
    netRouter[routerArr[i]] = router
}

export default [{
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
        path: '/',
        name: '_realEnv',
        redirect: 'realEnv/list',
        component: Main,
        meta: {
            notCache: true,
            access: ['200000'],
            title: '实景展示'
        },
        children: [{
                path: 'realEnv',
                name: 'realEnvIndex',
                meta: {
                    title: '全图展示',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'realEnvList',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'realEnvList',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 'all',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt1000',
                name: 'kilovolt1000Index',
                meta: {
                    title: '1000千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt1000List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt1000List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 1000,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt500',
                name: 'kilovolt500Index',
                meta: {
                    title: '500千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt500List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt500List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 500,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt220',
                name: 'kilovolt220Index',
                meta: {
                    title: '220千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt220List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt220List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 220,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt110',
                name: 'kilovolt110Index',
                meta: {
                    title: '110千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt110List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt110List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 110,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt35',
                name: 'kilovolt35Index',
                meta: {
                    title: '35千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt35List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt35List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 35,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
            {
                path: 'kilovolt10',
                name: 'kilovolt10Index',
                meta: {
                    title: '10千伏',
                    access: ['200001'],
                    notCache: true,
                    toListName: 'kilovolt10List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'kilovolt10List',
                    meta: {
                        access: ['11001010'],
                        title: '列表',
                        kind: 10,
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/realEnv/index.vue'),
                }]
            },
        ]
    },
    {
        path: '/',
        name: '_surveillance',
        component: Main,
        meta: {
            hide: true,
            hideInMenu: true,
            title: '视频监控',
            notCache: true,
        },
        children: [{
            path: 'surveillancePath',
            name: 'surveillanceName',
            meta: {
                title: '视频监控',
                notCache: true,
                toListName: 'surveillanceList',
            },
            component: parentView,
            children: [{
                    path: 'list',
                    name: 'surveillanceList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/index.vue')
                },
                {
                    path: 'detailLight',
                    name: 'surveillanceList',
                    meta: {
                        title: '可见光详情',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/detailVlight.vue')
                },
                {
                    path: 'detailRed',
                    name: 'surveillanceList',
                    meta: {
                        title: '可见光详情',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/detailVRed.vue')
                }
            ]
        }]
    },
    {
        path: '/',
        name: '_abnormalInfo',
        component: Main,
        meta: {
            hide: true,
            hideInMenu: true,
            title: '异常信息',
            notCache: true,
        },
        children: [{
            path: 'abnormalInfoPath',
            name: 'abnormalInfoName',
            meta: {
                title: '异常信息',
                notCache: true,
                toListName: 'abnormalInfoList',
            },
            component: parentView,
            children: [{
                path: 'list',
                name: 'abnormalInfoList',
                meta: {
                    title: '列表',
                    hideInMenu: true,
                    isDetails: true
                },
                component: () => import('@/views/communal/abnormalInfo/index.vue')
            }]
        }]
    },
    {
        path: '/',
        name: '_environmental',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: '动态环境监测',
            notCache: true
        },
        children: [{
                path: 'environmental',
                name: 'environmental',
                meta: {
                    title: '动态环境总览',
                    notCache: true,
                    toListName: 'environmentalList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'environmentalList',
                        meta: {
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/security/index.vue')
                    },
                    {
                        path: 'security-all',
                        name: 'security-all',
                        meta: {
                            title: '所有动态环境警告',
                            icon: "icon-shouye",
                            hideInMenu: true,
                            isDetails: true,
                            active:'environmentalList'
                        },
                        component: () => import('@/views/communal/security/allSecurity.vue')
                    },
                ]
            },
            {
                path: 'environmental1000',
                name: 'environmental1000KV',
                meta: {
                    title: '1000千伏',
                    notCache: true,
                    toListName: 'environmental1000KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental1000KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
            {
                path: 'environmental500',
                name: 'environmental500KV',
                meta: {
                    title: '500千伏',
                    notCache: true,
                    toListName: 'environmental500KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental500KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
            {
                path: 'environmental220',
                name: 'environmental220KV',
                meta: {
                    title: '220千伏',
                    notCache: true,
                    toListName: 'environmental220KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental220KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
            {
                path: 'environmental110',
                name: 'environmental110KV',
                meta: {
                    title: '110千伏',
                    notCache: true,
                    toListName: 'environmental110KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental110KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
            {
                path: 'environmental35',
                name: 'environmental35KV',
                meta: {
                    title: '35千伏',
                    notCache: true,
                    toListName: 'environmental35KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental35KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
            {
                path: 'environmental10',
                name: 'environmental10KV',
                meta: {
                    title: '10千伏',
                    notCache: true,
                    toListName: 'environmental10KVList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'environmental10KVList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/security/securityNum.vue')
                }]
            },
        ]
    },
    {
        path: '/',
        name: '_equipment',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: '设备监测',
            notCache: true
        },
        children: [{
                path: 'visiblelight',
                name: 'visiblelight',
                meta: {
                    title: '可见光',
                    notCache: true,
                    toListName: 'visiblelightList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'visiblelightList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/equipment/visiblelight.vue')
                }]
            },
            {
                path: 'infrared',
                name: 'infrared',
                meta: {
                    title: '红外测温',
                    notCache: true,
                    toListName: 'infraredList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'infraredList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/equipment/infrared.vue')
                }]
            }
        ]
    },
    {
        path: '/',
        name: '_robot-inspection',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: '机器人巡检',
            notCache: true
        },
        children: [{
                path: 'robot-one',
                name: 'robot-one',
                meta: {
                    title: '机器人一',
                    notCache: true,
                    toListName: 'robot-oneList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'robot-oneList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/robotF/index.vue')
                }]
            },
            {
                path: 'robot-two',
                name: 'robot-two',
                meta: {
                    title: '机器人二',
                    notCache: true,
                    toListName: 'robot-twoList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'robot-twoList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/robotF/index.vue')
                }]
            }
        ]
    },
    {
        path: '/',
        name: '_ARglasses',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: 'AR眼镜巡检',
            notCache: true
        },
        children: [{
                path: 'ticket',
                name: 'ticket',
                meta: {
                    title: '两票制作',
                    notCache: true,
                    toListName: 'ticketList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'ticketList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('_c/duno-developing/index.vue')
                }]
            },
            {
                path: 'inspection',
                name: 'inspection',
                meta: {
                    title: '巡视记录',
                    notCache: true,
                    toListName: 'inspectionList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'inspectionList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('_c/duno-developing/index.vue')
                }]
            },
            {
                path: 'video',
                name: 'video',
                meta: {
                    title: '视频记录',
                    notCache: true,
                    toListName: 'videoList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'videoList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('_c/duno-developing/index.vue')
                }]
            },
        ]
    },
    {
        path: '/',
        name: '_configuration',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: '配置管理',
            notCache: true
        },
        children: [{
                path: 'configuration',
                name: 'configuration',
                meta: {
                    title: '任务配置',
                    notCache: true,
                    toListName: 'configurationList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'configurationList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/toConfigure/detail.vue')
                }]
            },
            {
                path: 'detection',
                name: 'detection',
                meta: {
                    title: '监测设备管理',
                    notCache: true,
                    toListName: 'detectionList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'detectionList',
                    meta: {
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/toConfigure/index.vue')
                }]
            }
            /*    {
                  path: 'detection-status',
                  name: 'detection-status',
                  meta: {
                    title: '检测设备状态',
                    notCache: true,
                    toListName: 'detection-statusList',
                    btnArr: []
                  },
                  component: parentView,
                  children: [
                      {
                        path: 'list',
                        name: 'detection-statusList',
                        meta: {
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('_c/duno-developing/index.vue')
                      }
                  ]
                },*/
        ]
    },
    {
        path: '/',
        name: '_report-forms',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: '所有报表',
            notCache: true
        },
        children: [{
                path: 'report',
                name: 'report',
                meta: {
                    title: '巡检任务报表',
                    icon:"icon-shouye",
                    notCache: true,
                    toListName: 'reportList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'reportList',
                        meta: {
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/alarmInfo/reportFrom.vue')
                    },
                    {
                        path: 'report-view',
                        name: 'report-view',
                        meta: {
                            title: '全面巡视',
                            hideInMenu: true,
                            isDetails: true,
                            active:'meterdataList'
                        },
                        component: () => import('@/views/communal/alarmInfo/viewReportDetail.vue')
                    },
                ]
            },
            {
                path: 'meterdata',
                name: 'meterdata',
                meta: {
                    title: '表计分析',
                    icon:"icon-shouye",
                    notCache: true,
                    toListName: 'meterdataList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'meterdataList',
                        meta: {
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/alarmInfo/analysis.vue')
                    },
                    {
                        path: 'meterdata-detail',
                        name: 'meterdata-detail',
                        meta: {
                            title: '所有表计分析',
                            hideInMenu: true,
                            isDetails: true,
                            active:'meterdataList'
                        },
                        component: () => import('@/views/communal/alarmInfo/detail.vue'),
                    },
                ]
            },
            {
                path: 'alarm-info',
                name: 'alarmInfo',
                meta: {
                    title: '告警信息',
                    icon: "icon-shouye",
                    notCache: true,
                    isAlone: true
                },
                component: () => import('@/views/communal/alarmInfo/index.vue')
            }
        ]
    },

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