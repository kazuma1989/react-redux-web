import React from 'react'
import styled from 'styled-components'

export function Overlay({
  onClick,
  className,
  children,
}: {
  onClick?(): void
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Container
      className={className}
      onClick={ev => {
        if (ev.target !== ev.currentTarget) return
        onClick?.()
      }}
    >
      {children}
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 8%, 0.4);
`
