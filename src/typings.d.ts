import type { Store, Dispatch } from 'redux'
import type { State, Action } from './reducer'

declare global {
  // https://parceljs.org/env.html
  const process: Process

  interface Process {
    env: {
      NODE_ENV: 'development' | 'production'
      API_ENDPOINT?: string
    }
  }
}

declare module 'react-redux' {
  interface DefaultRootState extends State {}
  function useDispatch<TDispatch = Dispatch<Action>>(): TDispatch
  function useStore<S = DefaultRootState>(): Store<S, Action>
}
