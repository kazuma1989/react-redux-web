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

test('Dialog.ConfirmDelete', async () => {
  const prev = produce(initialState, draft => {
    draft.deletingCardID = '3' as CardID

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

  const next = reducer(prev, {
    type: 'Dialog.ConfirmDelete',
  })

  const expected = produce(prev, draft => {
    draft.deletingCardID = undefined

    draft.cardsOrder = {
      ...draft.cardsOrder,
      B: 'B' as CardID,
      '3': null,
    }

    const column = draft.columns![1]!
    column.cards = []
  })

  assert.deepStrictEqual(next, expected)
})

test('Card.Drop', async () => {
  const prev = produce(initialState, draft => {
    draft.draggingCardID = '1' as CardID

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

  const next = reducer(prev, {
    type: 'Card.Drop',
    payload: {
      toID: '3' as CardID,
    },
  })

  const expected = produce(prev, draft => {
    draft.draggingCardID = undefined

    draft.cardsOrder = {
      ...draft.cardsOrder,
      A: '2' as CardID,
      B: '1' as CardID,
      '1': '3' as CardID,
    }

    const [card] = draft.columns![0].cards!.splice(0, 1)
    draft.columns![1].cards!.unshift(card)
  })

  assert.deepStrictEqual(next, expected)
})

test('InputForm.ConfirmInput', async () => {
  const prev = produce(initialState, draft => {
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
        text: 'hello',
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

  const next = reducer(prev, {
    type: 'InputForm.ConfirmInput',
    payload: {
      columnID: 'A' as ColumnID,
      cardID: 'new' as CardID,
    },
  })

  const expected = produce(prev, draft => {
    draft.cardsOrder = {
      ...draft.cardsOrder,
      A: 'new' as CardID,
      new: '1' as CardID,
    }

    const column = draft.columns![0]!
    column.text = ''
    column.cards!.unshift({
      id: 'new' as CardID,
      text: 'hello',
    })
  })

  assert.deepStrictEqual(next, expected)
})
