import LoginView from '../../src/views/LoginView.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'

describe('LoginView.vue', () => {
  test('renders login form', () => {
    const wrapper = mount(LoginView)
    expect(wrapper.text()).toMatch('Welcome Back')
  })
})
