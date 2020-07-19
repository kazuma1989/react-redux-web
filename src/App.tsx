import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { randomID, reorderPatch } from './util'
import { api, ColumnID, CardID } from './api'
import { Header as _Header } from './Header'
import { Column } from './Column'
import { DeleteDialog } from './DeleteDialog'
import { Overlay as _Overlay } from './Overlay'

export function App() {
  const dispatch = useDispatch()
  const columns = useSelector(state => state.columns)
  const cardsOrder = useSelector(state => state.cardsOrder)

  const cardIsBeingDeleted = useSelector(state => Boolean(state.deletingCardID))
  const cancelDelete = () =>
    dispatch({
      type: 'Dialog.CancelDelete',
    })

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

  const setText = (columnID: ColumnID, value: string) => {
    dispatch({
      type: 'InputForm.SetText',
      payload: {
        columnID,
        value,
      },
    })
  }

  const addCard = (columnID: ColumnID) => {
    const column = columns?.find(c => c.id === columnID)
    if (!column) return

    const text = column.text
    const cardID = randomID() as CardID

    const patch = reorderPatch(cardsOrder, cardID, cardsOrder[columnID])

    dispatch({
      type: 'InputForm.ConfirmInput',
      payload: {
        columnID,
        cardID,
      },
    })

    api('POST /v1/cards', {
      id: cardID,
      text,
    })
    api('PATCH /v1/cardsOrder', patch)
  }

  return (
    <Container>
      <Header />

      <MainArea>
        <HorizontalScroll>
          {!columns ? (
            <Loading />
          ) : (
            columns.map(({ id: columnID, title, cards, text }) => (
              <Column
                key={columnID}
                id={columnID}
                title={title}
                cards={cards}
                text={text}
                onTextChange={value => setText(columnID, value)}
                onTextConfirm={() => addCard(columnID)}
              />
            ))
          )}
        </HorizontalScroll>
      </MainArea>

      {cardIsBeingDeleted && (
        <Overlay onClick={cancelDelete}>
          <DeleteDialog />
        </Overlay>
      )}
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

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`
