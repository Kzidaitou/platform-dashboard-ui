<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { loginApi, getTestRoleApi, getAdminRoleApi } from '@/api/login'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouteRecordRaw } from 'vue-router'
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElCheckbox,
  ElLink
} from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'

const { required } = useValidator()

const { t } = useI18n()

const appStore = useAppStore()

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push } = useRouter()

const { wsCache } = useCache()

const loading = ref(false)

const redirect = ref<string>('')

const formData = reactive({
  username: 'admin',
  password: 'admin',
  role: '',
  roleId: '',
  permissions: ''
})

const rules = {
  username: [required()],
  password: [required()]
}

const remember = ref(false)

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    redirect.value = route?.query?.redirect as string
  },
  {
    immediate: true
  }
)

// 登录
const signIn = async () => {
  loading.value = true
  try {
    const res = await loginApi(formData)
    if (res) {
      wsCache.set(appStore.getUserInfo, res.data)
      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        getRole()
      } else {
        await permissionStore.generateRoutes('none').catch(() => {})
        permissionStore.getAddRouters.forEach((route) => {
          addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
        })
        permissionStore.setIsAddRouters(true)
        push({ path: redirect.value || permissionStore.addRouters[0].path })
      }
    }
  } finally {
    loading.value = false
  }
}

// 获取角色信息
const getRole = async () => {
  const params = {
    roleName: formData.username
  }
  // admin - 模拟后端过滤菜单
  // test - 模拟前端过滤菜单
  const res =
    formData.username === 'admin' ? await getAdminRoleApi(params) : await getTestRoleApi(params)
  if (res) {
    const { wsCache } = useCache()
    const routers = res.data || []
    wsCache.set('roleRouters', routers)

    formData.username === 'admin'
      ? await permissionStore.generateRoutes('admin', routers).catch(() => {})
      : await permissionStore.generateRoutes('test', routers).catch(() => {})

    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(true)
    push({ path: redirect.value || permissionStore.addRouters[0].path })
  }
}
</script>

<template>
  <ElForm
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    label-position="top"
    hide-required-asterisk
    size="large"
    class="dark:(border-1 border-[var(--el-border-color)] border-solid)"
  >
    <ElRow :gutter="20">
      <ElCol :span="24">
        <h2 class="text-2xl font-bold text-center w-[100%]">{{ t('login.login') }}</h2>
      </ElCol>
      <ElCol :span="24">
        <ElFormItem label="账号" prop="username">
          <ElInput v-model="formData.username" placeholder="请输入账号" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="24">
        <ElFormItem label="密码" prop="username">
          <ElInput
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="24">
        <ElFormItem>
          <div class="flex justify-between items-center w-[100%]">
            <ElCheckbox v-model="remember" :label="t('login.remember')" size="small" />
            <ElLink type="primary" :underline="false">{{ t('login.forgetPassword') }}</ElLink>
          </div>
        </ElFormItem>
      </ElCol>
      <ElCol :span="24">
        <ElFormItem>
          <div class="w-[100%]">
            <ElButton :loading="loading" type="primary" class="w-[100%]" @click="signIn">
              {{ t('login.login') }}
            </ElButton>
          </div>
        </ElFormItem>
      </ElCol>
    </ElRow>
  </ElForm>
</template>

<style lang="less" scoped>
.@{elNamespace}-form .@{elNamespace}-row {
  margin-right: 0 !important;
  margin-left: 0 !important;
}
:deep(.anticon) {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}
</style>
