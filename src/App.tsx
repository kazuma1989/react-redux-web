import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { api } from './api'
import { Header as _Header } from './Header'
import { Column } from './Column'
import { DeleteDialog } from './DeleteDialog'
import { Overlay as _Overlay } from './Overlay'

export function App() {
  const dispatch = useDispatch()
  const columns = useSelector(
    state => state.columns?.map(v => v.id),
    shallowEqual,
  )

  useEffect(() => {
    ;(async () => {
      const columns = await api('GET /v1/columns', null)

      dispatch({
        type: 'App.SetColumns',
        payload: {
          columns,
        },
      })

      const [unorderedCards, cardsOrder] = await Promise.all([
        api('GET /v1/cards', null),
        api('GET /v1/cardsOrder', null),
      ])

      dispatch({
        type: 'App.SetCards',
        payload: {
          cards: unorderedCards,
          cardsOrder,
        },
      })
    })()
  }, [dispatch])

  return (
    <Container>
      <Header />

      <MainArea>
        <HorizontalScroll>
          {!columns ? (
            <Loading />
          ) : (
            columns.map(id => <Column key={id} id={id} />)
          )}
        </HorizontalScroll>
      </MainArea>

      <DialogOverlay />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`

const Header = styled(_Header)`
  flex-shrink: 0;
`

const MainArea = styled.div`
  height: 100%;
  padding: 16px 0;
  overflow-y: auto;
`

const HorizontalScroll = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    margin-left: 16px;
    flex-shrink: 0;
  }

  ::after {
    display: block;
    flex: 0 0 16px;
    content: '';
  }
`

const Loading = styled.div.attrs({
  children: 'Loading...',
})`
  font-size: 14px;
`

function DialogOverlay() {
  const dispatch = useDispatch()
  const cardIsBeingDeleted = useSelector(state => Boolean(state.deletingCardID))

  const cancelDelete = () =>
    dispatch({
      type: 'Dialog.CancelDelete',
    })

  if (!cardIsBeingDeleted) {
    return null
  }

  return (
    <Overlay onClick={cancelDelete}>
      <DeleteDialog />
    </Overlay>
  )
}

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`
