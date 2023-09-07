import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const adminList = [
  {
    path: '/dashboard',
    component: '#',
    redirect: '/dashboard/demoPage',
    name: 'Dashboard',
    meta: {
      title: 'router.dashboard',
      icon: 'ant-design:dashboard-filled',
      alwaysShow: true
    },
    children: [
      {
        path: 'demoPage',
        component: 'views/Dashboard/DemoPage',
        name: 'DemoPage',
        meta: {
          title: '示例页',
          noCache: true
        }
      }
    ]
  }
]

const testList: string[] = ['/dashboard', '/dashboard/demoPage']

export default [
  // 列表接口
  {
    url: '/role/list',
    method: 'get',
    timeout,
    response: ({ query }) => {
      const { roleName } = query
      return {
        code: result_code,
        data: roleName === 'admin' ? adminList : testList
      }
    }
  }
] as MockMethod[]
