import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'

describe('Hamburger.vue', () => {
  it('toggle click', async () => {
    const wrapper = shallowMount(Hamburger)
    await wrapper.find('.hamburger').trigger('click')
    expect(wrapper.emitted('toggleClick')).toBeTruthy()
  })

  it('prop isActive', async () => {
    const wrapper = shallowMount(Hamburger)
    
    await wrapper.setProps({ isActive: true })
    // 关键修正：查找带有 hamburger 类的 svg 元素，再检查 is-active 类
    const svg = wrapper.find('.hamburger')
    expect(svg.classes('is-active')).toBe(true)
    
    await wrapper.setProps({ isActive: false })
    expect(svg.classes('is-active')).toBe(false)
  })
})