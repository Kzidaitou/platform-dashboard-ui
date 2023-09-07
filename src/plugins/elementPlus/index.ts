import type { App } from 'vue'

// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import {
  ElLoading,
  ElScrollbar,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRow,
  ElCol,
  ElSpace,
  ElTooltip,
  ElDatePicker,
  ElTimePicker,
  ElCheckbox,
  ElCheckboxGroup,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCard,
  ElPagination,
  ElImage,
  ElTable
} from 'element-plus'

const plugins = [ElLoading]

const components = [
  ElScrollbar,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElRow,
  ElCol,
  ElSpace,
  ElTooltip,
  ElDatePicker,
  ElTimePicker,
  ElCheckbox,
  ElCheckboxGroup,
  ElInputNumber,
  ElSelect,
  ElOption,
  ElCard,
  ElPagination,
  ElImage,
  ElTable
]

export const setupElementPlus = (app: App<Element>) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name, component)
  })
}
