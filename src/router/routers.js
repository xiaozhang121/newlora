import Main from '@/views/duno-default/main'
import parentView from '@/components/parent-view'
// import parentVideo from '@/components/duno-c/parent-video'
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
    {
        path: '/newPage/:name/:value/:info/:detailsType/:userName',
        name: 'newPage',
        props: true,
        meta: {
            title: '列表',
            hideMenuAuthority: true,
            hideInMenu: true,
            isLogin: true
        },
        component: () => import('@/components/duno-j/warning/newPage.vue')
    },
    {
        path: '/newPageRobot/:datainfo/:info/:bread/:taskDeviceId',
        name: 'newPageRobot',
        props: true,
        meta: {
            title: '列表',
            hideMenuAuthority: true,
            hideInMenu: true,
            isLogin: true
        },
        component: () => import('@/components/duno-j/warning/newPageRobot.vue')
    },
    {
        path: '/newPageT/:name/:value/:info/:detailsType/:userName',
        name: 'newPageT',
        props: true,
        meta: {
            title: '列表',
            hideMenuAuthority: true,
            hideInMenu: true,
            isLogin: true
        },
        component: () => import('@/components/duno-j/warningT/newPage.vue')
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
            title: '全站总览'
        },
        children: [{
                path: 'realEnv',
                name: 'realEnvIndex',
                meta: {
                    title: '全部电压',
                    topNav: '2',
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
                        title: '列表',
                        topNav: '2',
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
                    topNav: '2',
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
                        title: '列表',
                        kind: 1000,
                        topNav: '2',
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
                    topNav: '2',
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
                        topNav: '2',
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
                    topNav: '2',
                    title: '220千伏',
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
                        topNav: '2',
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
                    topNav: '2',
                    title: '110千伏',
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
                        topNav: '2',
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
                    topNav: '2',
                    title: '35千伏',
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
                        topNav: '2',
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
                    topNav: '2',
                    title: '10千伏',
                    notCache: true,
                    toListName: 'kilovolt10List',
                    btnArr: [{
                        'name': '列表',
                        'code': '200001_1'
                    }]
                },
                component: parentView,
                children: [{
                    topNav: '2',
                    path: 'list',
                    name: 'kilovolt10List',
                    meta: {
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
                topNav: '3',
                title: '视频监控',
                notCache: true,
                toListName: 'surveillanceList',
            },
            component: parentView,
            children: [{
                    path: 'list',
                    name: 'surveillanceList',
                    meta: {
                        topNav: '3',
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/index.vue')
                },
                {
                    path: 'detailLight',
                    name: 'surveillanceListLight',
                    meta: {
                        topNav: '3',
                        isMain: true,
                        title: '可见光详情',
                        hideInMenu: true,
                        isDetails: true,
                    },
                    component: () => import('@/views/communal/surveillance/detailVlight.vue')
                },
                {
                    path: 'detailRed',
                    name: 'surveillanceListRed',
                    meta: {
                        topNav: '3',
                        isMain: true,
                        title: '红外监测',
                        hideInMenu: true,
                        isDetails: true,
                    },
                    component: () => import('@/views/communal/surveillance/detailVRed.vue')
                },
                {
                    path: 'detailRedN',
                    name: 'surveillanceListLightN',
                    meta: {
                        topNav: '3',
                        isMain: true,
                        title: '红外监测',
                        hideInMenu: true,
                        isDetails: true,
                    },
                    component: () => import('@/views/communal/surveillance/detailRedNC.vue')
                },
                {
                    path: 'detailEnv',
                    name: 'surveillanceListImportant',
                    meta: {
                        topNav: '3',
                        isMain: true,
                        title: '重点监测区域',
                        hideInMenu: true,
                        isDetails: true,
                    },
                    component: () => import('@/views/communal/surveillance/detailEnv.vue')
                },
                {
                    path: 'detailLightN',
                    name: 'surveillanceListRedN',
                    meta: {
                        topNav: '3',
                        title: '可见光详情',
                        hideInMenu: true,
                        isDetails: true,
                    },
                    component: () => import('@/views/communal/surveillance/detailLightNC.vue')
                },
                {
                    path: 'areaVideo',
                    name: 'surveillanceList',
                    meta: {
                        topNav: '3',
                        title: '分区域视频流',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/areaVideo.vue')
                },
                {
                    path: 'ballControl',
                    name: 'surveillanceList',
                    meta: {
                        topNav: '3',
                        title: '布控球详情',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/surveillance/ballControl.vue')
                },
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
            title: '功能卡片',
            notCache: true,
        },
        children: [{
            path: 'abnormalInfoPath',
            name: 'abnormalInfoName',
            meta: {
                topNav: '1',
                title: '功能卡片',
                notCache: true,
                toListName: 'abnormalInfoList',
            },
            component: parentView,
            children: [{
                    path: 'home',
                    name: 'abnormalInfoList',
                    meta: {
                        topNav: '1',
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/abnormalInfo/home.vue')
                },
                {
                    path: 'list',
                    name: 'abnormalInfoList',
                    meta: {
                        topNav: '1',
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/abnormalInfo/index.vue')
                },
                {
                    path: 'list/report',
                    name: 'abnormalInfoList-report',
                    meta: {
                        topNav: '1',
                        title: '列表',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/abnormalInfo/reportDetail.vue')
                },
                {
                    path: 'algoInd',
                    name: 'algoIndList',
                    meta: {
                        topNav: '1',
                        title: '算法指标',
                        hideInMenu: true,
                        isDetails: true
                    },
                    component: () => import('@/views/communal/abnormalInfo/algoInd.vue')
                }
            ]
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
                    topNav: '2',
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
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/security/index.vue')
                    },
                    {
                        path: 'record-all',
                        name: 'record-all',
                        meta: {
                            topNav: '2',
                            title: '24小时监测记录',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'environmentalList'
                        },
                        component: () => import('@/views/communal/security/allRecord.vue')
                    },
                    {
                        path: 'security-all',
                        name: 'security-all',
                        meta: {
                            topNav: '2',
                            title: '所有动态环境警告',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'environmentalList'
                        },
                        component: () => import('@/views/communal/security/allSecurity.vue')
                    },
                ]
            },
            {
                path: 'environmental1000',
                name: 'environmental1000KV',
                meta: {
                    topNav: '2',
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
                        topNav: '2',
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
                    topNav: '2',
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
                        topNav: '2',
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
                    topNav: '2',
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
                        topNav: '2',
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
                        topNav: '2',
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
                    topNav: '2',
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
                        topNav: '2',
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
                    topNav: '2',
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
                        topNav: '2',
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
        children: [
            // {
            //     path: 'overview',
            //     name: 'overview',
            //     meta: {
            //         topNav: '2',
            //         title: '信息总览',
            //         notCache: true,
            //         toListName: 'overviewList',
            //         btnArr: []
            //     },
            //     component: parentView,
            //     children: [{
            //         path: 'list',
            //         name: 'overviewList',
            //         meta: {
            //             topNav: '2',
            //             title: '列表',
            //             hideInMenu: true,
            //             isDetails: true
            //         },
            //         component: () => import('@/views/communal/equipment/overview.vue')

            //     }]
            // },
            {
                path: 'visiblelight',
                name: 'visiblelight',
                meta: {
                    topNav: '2',
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
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/equipment/visiblelight.vue')
                    },
                    {
                        path: 'light-report',
                        name: 'light-report',
                        meta: {
                            topNav: '2',
                            title: '可见光',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'visiblelightList'
                        },
                        component: () => import('@/views/communal/equipment/reportDetail.vue')
                    },
                    {
                        path: 'light-info',
                        name: 'light-info',
                        meta: {
                            topNav: '2',
                            title: '可见光',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'visiblelightList'
                        },
                        component: () => import('@/views/communal/equipment/infoDetail.vue')
                    },
                    {
                        path: 'light-detail',
                        name: 'light-detail',
                        meta: {
                            topNav: '2',
                            title: '可见光',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'visiblelightList'
                        },
                        component: () => import('@/views/communal/equipment/allReportDetail.vue')
                    },
                ]
            },
            {
                path: 'infrared',
                name: 'infrared',
                meta: {
                    topNav: '2',
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
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/equipment/infrared.vue')
                    },
                    {
                        path: 'infrared-report',
                        name: 'infrared-report',
                        meta: {
                            topNav: '2',
                            title: '红外监测',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'infraredList'
                        },
                        component: () => import('@/views/communal/equipment/reportDetail.vue')
                    },
                    {
                        path: 'infrared-info',
                        name: 'infrared-info',
                        meta: {
                            topNav: '2',
                            title: '红外监测',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'infraredList'
                        },
                        component: () => import('@/views/communal/equipment/infoDetail.vue')
                    },
                    {
                        path: 'infrared-detail',
                        name: 'infrared-detail',
                        meta: {
                            topNav: '2',
                            title: '红外监测',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'infraredList'
                        },
                        component: () => import('@/views/communal/equipment/allReportDetail.vue')
                    },
                ]
            }
        ]
    },
    {
        path: '/',
        name: '_robot-inspection',
        component: Main,
        meta: {
            topNav: '2',
            hide: true,
            isAlone: true,
            title: '机器人巡视',
            notCache: true
        },
        children: [{
                path: 'robot-one',
                name: 'robot-one',
                meta: {
                    topNav: '2',
                    title: '机器人',
                    notCache: true,
                    toListName: 'robot-oneList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'robot-oneList',
                        meta: {
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/robotF/index.vue')
                    },
                    {
                        path: 'report',
                        name: 'robot-oneList',
                        meta: {
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true,
                            active: "robot-oneList"
                        },
                        component: () => import('@/views/communal/robotF/viewReportDetail.vue')
                    },
                    {
                        path: 'detail',
                        name: 'robot-oneList',
                        active: "robot-oneList",
                        meta: {
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true,
                            active: "robot-oneList"
                        },
                        component: () => import('@/views/communal/robotF/detail.vue')
                    }
                ]
            },
            // {
            //     path: 'robot-two',
            //     name: 'robot-two',
            //     meta: {
            //         topNav: '2',
            //         title: '机器人二',
            //         notCache: true,
            //         toListName: 'robot-twoList',
            //         btnArr: []
            //     },
            //     component: parentView,
            //     children: [{
            //         path: 'list',
            //         name: 'robot-twoList',
            //         meta: {
            //             topNav: '2',
            //             title: '列表',
            //             hideInMenu: true,
            //             isDetails: true
            //         },
            //         component: () => import('@/views/communal/robotF/index.vue')
            //     },
            //     {
            //         path: 'report',
            //         name: 'robot-twoList',
            //         meta: {
            //             topNav: '2',
            //             title: '列表',
            //             hideInMenu: true,
            //             isDetails: true,
            //             active: "robot-twoList"
            //         },
            //         component: () => import('@/views/communal/robotF/viewReportDetail.vue')
            //     },
            //     {
            //         path: 'detail',
            //         name: 'robot-twoList',
            //         active: "robot-oneList",
            //         meta: {
            //             topNav: '2',
            //             title: '列表',
            //             hideInMenu: true,
            //             isDetails: true,
            //             active: "robot-twoList"
            //         },
            //         component: () => import('@/views/communal/robotF/detail.vue')
            //     }]
            // }
        ]
    },
    {
        path: '/',
        name: '_ARglasses',
        component: Main,
        meta: {
            hide: true,
            isAlone: true,
            title: 'AR眼镜巡视',
            notCache: true
        },
        children: [{
                path: 'ticket',
                name: 'ticket',
                meta: {
                    topNav: '2',
                    title: '工作任务',
                    notCache: true,
                    toListName: 'ticketList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'ticketList',
                    meta: {
                        topNav: '2',
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
                    topNav: '2',
                    title: '巡视报告',
                    notCache: true,
                    toListName: 'inspectionList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'inspectionList',
                    meta: {
                        topNav: '2',
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
                    topNav: '2',
                    title: '巡视视频',
                    notCache: true,
                    toListName: 'videoList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                    path: 'list',
                    name: 'videoList',
                    meta: {
                        topNav: '2',
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
            topNav: '2',
            hide: true,
            isAlone: true,
            title: '配置管理',
            notCache: true
        },
        children: [{
                path: 'configuration',
                name: 'configuration',
                meta: {
                    topNav: '2',
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
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/toConfigure/detail.vue')
                    },
                    {
                        path: 'configure-report',
                        name: 'configure-report',
                        meta: {
                            topNav: '2',
                            title: '任务配置',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'configurationList'
                        },
                        component: () => import('@/views/communal/toConfigure/reportDetail.vue')
                    },
                    {
                        path: 'configure-view',
                        name: 'configure-view',
                        meta: {
                            topNav: '2',
                            title: '任务配置',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'configurationList'
                        },
                        component: () => import('@/views/communal/toConfigure/viewDetail.vue')
                    },
                ]
            },
            {
                path: 'detection',
                name: 'detection',
                meta: {
                    topNav: '2',
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
                            topNav: '2',
                            title: '列表',
                            hideInMenu: true,
                            isDetails: true
                        },
                        component: () => import('@/views/communal/toConfigure/index.vue')
                    },
                    {
                        path: 'detection-report',
                        name: 'detection-report',
                        meta: {
                            topNav: '2',
                            title: '监测设备管理',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'detectionList'
                        },
                        component: () => import('@/views/communal/toConfigure/viewDetail.vue')
                    },
                ]
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
            notCache: true,
            topNav: '2'
        },
        children: [{
                path: 'report',
                name: 'report',
                meta: {
                    topNav: '2',
                    title: '巡检任务报表',
                    notCache: true,
                    toListName: 'reportList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'reportList',
                        meta: {
                            topNav: '2',
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
                            topNav: '2',
                            title: '全面巡视',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'reportList'
                        },
                        component: () => import('@/views/communal/alarmInfo/detail.vue'),
                    },
                ]
            },
            {
                path: 'meterdata',
                name: 'meterdata',
                meta: {
                    topNav: '2',
                    title: '表计分析',
                    notCache: true,
                    toListName: 'meterdataList',
                    btnArr: []
                },
                component: parentView,
                children: [{
                        path: 'list',
                        name: 'meterdataList',
                        meta: {
                            topNav: '2',
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
                            topNav: '2',
                            title: '所有表计分析',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'meterdataList'
                        },
                        component: () => import('@/views/communal/alarmInfo/detail.vue'),
                    },
                    {
                        path: 'allReport-detail',
                        name: 'allReport-detail',
                        meta: {
                            topNav: '2',
                            title: '所有表计分析',
                            hideInMenu: true,
                            isDetails: true,
                            active: 'meterdataList'
                        },
                        component: () => import('@/views/communal/alarmInfo/viewReportDetail.vue'),
                    },
                ]
            }
            /* ,
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
             }*/
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