import { ref } from 'vue'
import { defineStore } from 'pinia'
import defaultSettings from '@/setting'

export const useSettingsStore = defineStore('settings', () => {

  const showSettings = ref(defaultSettings.showSettings)
  const fixedHeader = ref(defaultSettings.fixedHeader)
  const sidebarLogo = ref(defaultSettings.sidebarLogo)

  function changeSetting({ key, value }) {
    if (Object.hasOwn({ showSettings: showSettings.value, fixedHeader: fixedHeader.value, sidebarLogo: sidebarLogo.value }, key)) {
      // 根据 key 动态更新对应的 ref
      switch (key) {
        case 'showSettings':
          showSettings.value = value
          break
        case 'fixedHeader':
          fixedHeader.value = value
          break
        case 'sidebarLogo':
          sidebarLogo.value = value
          break
      }
    }
  }

  return {
    showSettings,
    fixedHeader,
    sidebarLogo,
    changeSetting
  }
})