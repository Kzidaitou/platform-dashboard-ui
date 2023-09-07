import { config } from '@/config/axios/config'
import { MockMethod } from 'vite-plugin-mock'

const { result_code } = config

const timeout = 1000

const List: {
  username: string
  password: string
  role: string
  roleId: string
  permissions: string | string[]
}[] = [
  {
    username: 'admin',
    password: 'admin',
    role: 'admin',
    roleId: '1',
    permissions: ['*.*.*']
  },
  {
    username: 'test',
    password: 'test',
    role: 'test',
    roleId: '2',
    permissions: ['example:dialog:create', 'example:dialog:delete']
  }
]

export default [
  // 登录接口
  {
    url: '/user/login',
    method: 'post',
    timeout,
    response: ({ body }) => {
      const data = body
      let hasUser = false
      for (const user of List) {
        if (user.username === data.username && user.password === data.password) {
          hasUser = true
          return {
            code: result_code,
            data: user
          }
        }
      }
      if (!hasUser) {
        return {
          code: '500',
          message: '账号或密码错误'
        }
      }
    }
  },
  // 退出接口
  {
    url: '/user/loginOut',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: result_code,
        data: null
      }
    }
  }
] as MockMethod[]
