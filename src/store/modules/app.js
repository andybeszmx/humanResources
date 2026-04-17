import { ref } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

export const useAppStore = defineStore('app', () => {
  // state
  const sidebar = ref({
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  })
  const device = ref('desktop')

  function toggleSideBar() {
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
    if (sidebar.value.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  }

  function closeSideBar(withoutAnimation) {
    Cookies.set('sidebarStatus', 0)
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  function toggleDevice(deviceVal) {
    device.value = deviceVal
  }

  // 返回需要暴露的内容
  return {
    sidebar,
    device,
    toggleSideBar,
    closeSideBar,
    toggleDevice
  }
})