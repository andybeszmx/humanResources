import { shallowMount } from '@vue/test-utils'
import Hamburger from '@/components/Hamburger/index.vue'

describe('Hamburger.vue', () => {
  it('toggle click', () => {
    const wrapper = shallowMount(Hamburger)
    const mockFn = jest.fn()
    // Vue3 中 $on 已移除，改用 wrapper.vm.$emit 监听
    wrapper.vm.$on = mockFn // 兼容写法（或直接监听 emit）
    // 推荐写法：wrapper.emitted('toggleClick')
    wrapper.find('.hamburger').trigger('click')
    expect(mockFn).toBeCalled()
    // 更符合 Vue3 的写法：
    // wrapper.find('.hamburger').trigger('click')
    // expect(wrapper.emitted('toggleClick')).toBeTruthy()
  })
  it('prop isActive', () => {
    const wrapper = shallowMount(Hamburger)
    wrapper.setProps({ isActive: true })
    expect(wrapper.classes('is-active')).toBe(true) // Vue3 推荐写法
    wrapper.setProps({ isActive: false })
    expect(wrapper.classes('is-active')).toBe(false)
  })
})