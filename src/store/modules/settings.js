import { defineStore } from 'pinia'
import defaultSettings from '@/setting'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    showSettings: showSettings,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo
  }),
  actions: {
    // 对应原 CHANGE_SETTING mutation/action
    changeSetting({ key, value }) {
      if (Object.hasOwn(this.$state, key)) {
        this[key] = value
      }
    }
  }
})