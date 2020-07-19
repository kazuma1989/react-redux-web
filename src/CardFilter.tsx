import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useStore } from 'react-redux'
import * as color from './color'
import { SearchIcon as _SearchIcon } from './icon'

export function CardFilter() {
  const store = useStore()
  const dispatch = useDispatch()

  const [value, setValue] = useState('')

  useEffect(
    () =>
      store.subscribe(() => {
        const { filterValue } = store.getState()
        if (value === filterValue) return

        setValue(filterValue)
      }),
    [store, value],
  )

  useEffect(() => {
    const timer = setTimeout(
      () =>
        dispatch({
          type: 'Filter.SetFilter',
          payload: {
            value,
          },
        }),
      400,
    )

    return () => clearTimeout(timer)
  }, [dispatch, value])

  return (
    <Container>
      <SearchIcon />
      <Input
        placeholder="Filter cards"
        value={value}
        onChange={ev => setValue(ev.currentTarget.value)}
      />
    </Container>
  )
}

const Container = styled.label`
  display: flex;
  align-items: center;
  min-width: 300px;
  border: solid 1px ${color.Silver};
  border-radius: 3px;
`

const SearchIcon = styled(_SearchIcon)`
  margin: 0 4px 0 8px;
  font-size: 16px;
  color: ${color.Silver};
`

const Input = styled.input.attrs({ type: 'search' })`
  width: 100%;
  padding: 6px 8px 6px 0;
  color: ${color.White};
  font-size: 14px;

  :focus {
    outline: none;
  }
`
