import React from 'react';

import {
  Container, Description, Title
} from './styles';

export function UIButton({title, onPress, color, description, ...rest}: {
  title: string;
  onPress(): void;
  color: string;
  description?: string;
}) {
  return (
    <Container onPress={onPress} color={color} {...rest}>
      {!!description && <Description>{description}</Description>}
      <Title>{title}</Title>
    </Container>
  );
}
