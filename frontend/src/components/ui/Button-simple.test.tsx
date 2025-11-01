import { describe, it, expect } from 'vitest'

describe('Button export check', () => {
  it('should import Button successfully', async () => {
    const module = await import('./Button')
    console.log('Button module:', module)
    console.log('Button export:', module.Button)
    expect(module.Button).toBeDefined()
    expect(typeof module.Button).toBe('function')
  })

  it('should import ButtonProps interface', async () => {
    const module = await import('./Button')
    expect(module.ButtonProps).toBeDefined()
  })
})
