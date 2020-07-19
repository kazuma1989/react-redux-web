import baretest from 'baretest'
import assert from 'assert'
import { randomID, sortBy, reorderPatch } from '../src/util'

const test = baretest('util')
setImmediate(() => test.run())

test('randomID: 重複しない', async () => {
  // 10,000 程度なら重複する確率はゼロ
  const size = 10_000
  const unique = new Set<string>()

  for (let i = 0; i < size; i++) {
    const id = randomID()
    unique.add(id)
  }

  // Set オブジェクトは重複した値を保持しないので、id が重複すると unique.size の値が size より小さくなる
  assert.equal(unique.size, size)
})

test('randomID: 書式パターンどおりに生成される', async () => {
  const pattern = /^[0-9A-Za-z_-]{12}$/
  const id = randomID()

  assert.ok(pattern.test(id), `${id} does not match ${pattern}`)
})

test('sortBy', async () => {
  const sorted = sortBy(
    [
      {
        id: '3',
      },
      {
        id: '2',
      },
      {
        id: '1',
      },
    ],
    {
      A: '1',
      '1': '2',
      '1.5': null,
      '2': 'A',
      B: '3',
      '3': 'B',
    },
    'A',
  )

  const expected = [
    {
      id: '1',
    },
    {
      id: '2',
    },
  ]

  assert.deepStrictEqual(sorted, expected)
})

test('reorderPatch', async () => {
  const patch = reorderPatch(
    {
      A: '1',
      '1': '2',
      '1.5': null,
      '2': 'A',
      B: '3',
      '3': 'B',
    },
    '1',
    'A',
  )

  const expected = {
    A: '2',
    '2': '1',
    '1': 'A',
  }

  assert.deepStrictEqual(patch, expected)
})
