import baretest from 'baretest'
import assert from 'assert'
import produce from 'immer'
import { reducer, State } from '../src/reducer'
import { ColumnID, CardID } from '../src/api'

const test = baretest('reducer')
setImmediate(() => test.run())

const initialState: State = {
  filterValue: '',
  cardsOrder: {},
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

test('App.SetCards', async () => {
  const prev = produce(initialState, draft => {
    draft.columns = [
      {
        id: 'A' as ColumnID,
      },
      {
        id: 'B' as ColumnID,
      },
    ]
  })

  const next = reducer(prev, {
    type: 'App.SetCards',
    payload: {
      cards: [
        {
          id: '3' as CardID,
        },
        {
          id: '2' as CardID,
        },
        {
          id: '1' as CardID,
        },
      ],
      cardsOrder: {
        A: '1' as CardID,
        '1': '2' as CardID,
        '2': 'A' as CardID,
        B: '3' as CardID,
        '3': 'B' as CardID,
      },
    },
  })

  const expected = produce(prev, draft => {
    draft.cardsOrder = {
      A: '1' as CardID,
      '1': '2' as CardID,
      '2': 'A' as CardID,
      B: '3' as CardID,
      '3': 'B' as CardID,
    }
    draft.columns = [
      {
        id: 'A' as ColumnID,
        cards: [
          {
            id: '1' as CardID,
          },
          {
            id: '2' as CardID,
          },
        ],
      },
      {
        id: 'B' as ColumnID,
        cards: [
          {
            id: '3' as CardID,
          },
        ],
      },
    ]
  })

  assert.deepStrictEqual(next, expected)
})
