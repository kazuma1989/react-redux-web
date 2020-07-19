import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import produce from 'immer'
import { randomID, sortBy, reorderPatch } from './util'
import { api, ColumnID, CardID } from './api'
import { Header as _Header } from './Header'
import { Column } from './Column'
import { DeleteDialog } from './DeleteDialog'
import { Overlay as _Overlay } from './Overlay'

type State = {
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
}

export function App() {
  const dispatch = useDispatch()
  const filterValue = useSelector(state => state.filterValue)
  const setFilterValue = (value: string) =>
    dispatch({
      type: 'Filter.SetFilter',
      payload: {
        value,
      },
    })

  const columns = useSelector(state => state.columns)
  const cardsOrder = useSelector(state => state.cardsOrder)
  // TODO ビルドを通すためだけのスタブ実装なので、ちゃんとしたものにする
  const setData = fn => fn({ cardsOrder: {} })

  const cardIsBeingDeleted = useSelector(state => Boolean(state.deletingCardID))
  const setDeletingCardID = (cardID: CardID) =>
    dispatch({
      type: 'Card.SetDeletingCard',
      payload: {
        cardID,
      },
    })
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

  const [draggingCardID, setDraggingCardID] = useState<CardID | undefined>(
    undefined,
  )

  const dropCardTo = (toID: CardID | ColumnID) => {
    const fromID = draggingCardID
    if (!fromID) return

    setDraggingCardID(undefined)

    if (fromID === toID) return

    const patch = reorderPatch(cardsOrder, fromID, toID)

    setData(
      produce((draft: State) => {
        draft.cardsOrder = {
          ...draft.cardsOrder,
          ...patch,
        }

        const unorderedCards = draft.columns?.flatMap(c => c.cards ?? []) ?? []
        draft.columns?.forEach(column => {
          column.cards = sortBy(unorderedCards, draft.cardsOrder, column.id)
        })
      }),
    )

    api('PATCH /v1/cardsOrder', patch)
  }

  const setText = (columnID: ColumnID, value: string) => {
    setData(
      produce((draft: State) => {
        const column = draft.columns?.find(c => c.id === columnID)
        if (!column) return

        column.text = value
      }),
    )
  }

  const addCard = (columnID: ColumnID) => {
    const column = columns?.find(c => c.id === columnID)
    if (!column) return

    const text = column.text
    const cardID = randomID() as CardID

    const patch = reorderPatch(cardsOrder, cardID, cardsOrder[columnID])

    setData(
      produce((draft: State) => {
        const column = draft.columns?.find(c => c.id === columnID)
        if (!column?.cards) return

        column.cards.unshift({
          id: cardID,
          text: column.text,
        })
        column.text = ''

        draft.cardsOrder = {
          ...draft.cardsOrder,
          ...patch,
        }
      }),
    )

    api('POST /v1/cards', {
      id: cardID,
      text,
    })
    api('PATCH /v1/cardsOrder', patch)
  }

  return (
    <Container>
      <Header filterValue={filterValue} onFilterChange={setFilterValue} />

      <MainArea>
        <HorizontalScroll>
          {!columns ? (
            <Loading />
          ) : (
            columns.map(({ id: columnID, title, cards, text }) => (
              <Column
                key={columnID}
                title={title}
                filterValue={filterValue}
                cards={cards}
                onCardDragStart={cardID => setDraggingCardID(cardID)}
                onCardDrop={entered => dropCardTo(entered ?? columnID)}
                onCardDeleteClick={cardID => setDeletingCardID(cardID)}
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
