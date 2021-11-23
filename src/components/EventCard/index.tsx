import React, { useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { IEvent, ITimer } from '../../screens/Home';
import { Feather } from '@expo/vector-icons';

import {
  Container, Content, DeleteButton, Description, Time, TimeDisplayContainer, Timer, Title
} from './styles';

export function EventCard({ item, handleDeleteEvent, convertTime, getTimer }: {
  item: IEvent;
  handleDeleteEvent(event: IEvent): Promise<void>;
  convertTime(id: number): string;
  getTimer(id: string): ITimer | undefined;
}) {
  const { name } = item
  const timer = getTimer(item.id)

  const [loading, setLoading] = useState(false)

  const complete = () => !!timer && !timer.days && !timer.hours && !timer.minutes && !timer.seconds

  function TimeDisplay({ time, description }: { time: number; description: string; }) {
    return (
      <TimeDisplayContainer>
        <Time>{convertTime(time)}</Time>
        <Description>{description}</Description>
      </TimeDisplayContainer>
    )
  }

  async function handleDelete() {
    if (loading) return

    setLoading(true)
    try {
      await handleDeleteEvent(item)
    } catch (error) {
      Alert.alert('Não foi possivel deletar o evento!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container complete={complete()}>
      <Content>
        <Title>{name}</Title>
        {!timer
          ? <ActivityIndicator size="large" color="#000" />
          : (
            <Timer>
              <TimeDisplay time={timer.days} description="DIAS" />
              <TimeDisplay time={timer.hours} description="HORAS" />
              <TimeDisplay time={timer.minutes} description="MINUTOS" />
              <TimeDisplay time={timer.seconds} description="SEGUNDOS" />
            </Timer>
          )
        }

      </Content>
      {!!timer && (
        <DeleteButton onPress={handleDelete}>
          {loading 
            ? <ActivityIndicator size="small" color="#fff" />
            : <Feather name="trash-2" size={20} color="#fff" />
          }
        </DeleteButton>
      )}
    </Container>
  )
}

