import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { reorderPatch } from './util'
import { api } from './api'
import * as color from './color'
import { Button, DangerButton } from './Button'

export function DeleteDialog({ className }: { className?: string }) {
  const dispatch = useDispatch()
  const deletingCardID = useSelector(state => state.deletingCardID)
  const cardsOrder = useSelector(state => state.cardsOrder)

  const onConfirm = () => {
    const cardID = deletingCardID
    if (!cardID) return

    dispatch({
      type: 'Dialog.ConfirmDelete',
    })

    api('DELETE /v1/cards', {
      id: cardID,
    })

    const patch = reorderPatch(cardsOrder, cardID)
    api('PATCH /v1/cardsOrder', patch)
  }

  const onCancel = () =>
    dispatch({
      type: 'Dialog.CancelDelete',
    })

  return (
    <Container className={className}>
      <Message>Are you sure to delete?</Message>

      <ButtonRow>
        <DeleteButton onClick={onConfirm} />
        <CancelButton autoFocus onClick={onCancel} />
      </ButtonRow>
    </Container>
  )
}

const Container = styled.div`
  min-width: 350px;
  box-shadow: 0 8px 12px hsla(0, 0%, 0%, 0.2);
  border: solid 1px ${color.Silver};
  border-radius: 4px;
  background-color: ${color.White};
`

const Message = styled.div`
  min-height: 100px;
  padding: 16px;
  color: ${color.Black};
  font-size: 14px;
  line-height: 1.7;
`

const ButtonRow = styled.div`
  display: flex;
  padding: 0 16px 16px;

  > :not(:first-child) {
    margin-left: 8px;
  }
`

const DeleteButton = styled(DangerButton).attrs({
  children: 'Delete',
})``

const CancelButton = styled(Button).attrs({
  children: 'Cancel',
})``
