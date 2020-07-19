import { Reducer } from 'redux'
import produce from 'immer'
import { sortBy, reorderPatch } from './util'
import { CardID, ColumnID } from './api'

export type State = {
  filterValue: string
  columns?: {
    id: ColumnID
    title?: string
    text?: string
    cards?: {
      id: CardID
      text?: string
    }[]
  }[]
  cardsOrder: Record<string, CardID | ColumnID | null>
  deletingCardID?: CardID
}

const initialState: State = {
  filterValue: '',
  cardsOrder: {},
}

export type Action =
  | {
      type: 'Filter.SetFilter'
      payload: {
        value: string
      }
    }
  | {
      type: 'App.SetColumns'
      payload: {
        columns: {
          id: ColumnID
          title?: string
          text?: string
        }[]
      }
    }
  | {
      type: 'App.SetCards'
      payload: {
        cards: {
          id: CardID
          text?: string
        }[]
        cardsOrder: Record<string, CardID | ColumnID | null>
      }
    }
  | {
      type: 'Card.SetDeletingCard'
      payload: {
        cardID: CardID
      }
    }
  | {
      type: 'Dialog.ConfirmDelete'
    }
  | {
      type: 'Dialog.CancelDelete'
    }

export const reducer: Reducer<State, Action> = produce(
  (draft: State, action: Action) => {
    switch (action.type) {
      case 'Filter.SetFilter': {
        const { value } = action.payload

        draft.filterValue = value
        return
      }

      case 'App.SetColumns': {
        const { columns } = action.payload

        draft.columns = columns
        return
      }

      case 'App.SetCards': {
        const { cards: unorderedCards, cardsOrder } = action.payload

        draft.cardsOrder = cardsOrder
        draft.columns?.forEach(column => {
          column.cards = sortBy(unorderedCards, cardsOrder, column.id)
        })
        return
      }

      case 'Card.SetDeletingCard': {
        const { cardID } = action.payload

        draft.deletingCardID = cardID
        return
      }

      case 'Dialog.ConfirmDelete': {
        const cardID = draft.deletingCardID
        if (!cardID) return

        draft.deletingCardID = undefined

        const column = draft.columns?.find(col =>
          col.cards?.some(c => c.id === cardID),
        )
        if (!column?.cards) return

        column.cards = column.cards.filter(c => c.id !== cardID)

        const patch = reorderPatch(draft.cardsOrder, cardID)
        draft.cardsOrder = {
          ...draft.cardsOrder,
          ...patch,
        }
        return
      }

      case 'Dialog.CancelDelete': {
        draft.deletingCardID = undefined
        return
      }

      default: {
        const _: never = action
      }
    }
  },
  initialState,
)
