import baretest from 'baretest'
import assert from 'assert'
import produce from 'immer'
import { reducer, State } from '../src/reducer'

const test = baretest('reducer')
setImmediate(() => test.run())

const initialState: State = {
  filterValue: '',
}

test('Filter.SetFilter', async () => {
  const prev = produce(initialState, draft => {
    draft.filterValue = 'hello'
  })

  const next = reducer(prev, {
    type: 'Filter.SetFilter',
    payload: {
      value: 'welcome',
    },
  })

  const expected = produce(prev, draft => {
    draft.filterValue = 'welcome'
  })

  assert.deepStrictEqual(next, expected)
})
