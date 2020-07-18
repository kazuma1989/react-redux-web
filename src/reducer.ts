import { Reducer } from 'redux'
import produce from 'immer'

export type State = {
  filterValue: string
}

const initialState: State = {
  filterValue: '',
}

export type Action = {
  type: 'Filter.SetFilter'
  payload: {
    value: string
  }
}

export const reducer: Reducer<State, Action> = produce(
  (draft: State, action: Action) => {
    switch (action.type) {
      case 'Filter.SetFilter': {
        const { value } = action.payload

        draft.filterValue = value
        return
      }
    }
  },
  initialState,
)
