import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

function App() {
  return (
    <Container>
      <Header>
        <Logo>Kanban board</Logo>

        <CardFilter placeholder="Filter cards" />
      </Header>

      <MainArea>
        <Column>
          <ColumnHeader>TODO</ColumnHeader>

          <Card>朝食をとる🍞</Card>
          <Card>SNSをチェックする🐦</Card>
          <Card>布団に入る (:3[___]</Card>
        </Column>

        <Column>
          <ColumnHeader>Doing</ColumnHeader>

          <Card>顔を洗う👐</Card>
          <Card>歯を磨く🦷</Card>
        </Column>

        <Column>
          <ColumnHeader>Waiting</ColumnHeader>
        </Column>

        <Column>
          <ColumnHeader>Done</ColumnHeader>

          <Card>布団から出る (:3っ)っ -=三[＿＿]</Card>
        </Column>
      </MainArea>
    </Container>
  )
}

const Container = styled.div``

const Header = styled.div``

const Logo = styled.div``

const CardFilter = styled.input``

const MainArea = styled.div``

const Column = styled.div``

const ColumnHeader = styled.div``

const Card = styled.div``

ReactDOM.render(<App />, document.getElementById('app'))
