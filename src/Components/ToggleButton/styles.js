import styled from 'styled-components'

export const Button = styled.button`
  background: ${props => (props.isActive ? 'gray' : 'lightgray')};
  cursor: pointer;
`
