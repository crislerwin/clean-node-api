import { test, expect, describe } from 'vitest'
import { sum } from './main'

describe('sum', () => {
  test('1 + 2 = 3', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
