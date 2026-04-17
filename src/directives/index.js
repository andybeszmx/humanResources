import { useUserStore } from "@/store"

export const permissionPlugin = {
  install(app) {
    app.directive('permission', {
  mounted(el, binding) {
    // el 指令作用的元素的dom对象
    const userStore = useUserStore()
    const points = userStore.info?.roles?.points || []
    if (!points.includes(binding.value)) {
      el.remove() // 删除元素
    }
  }
})
  }
}