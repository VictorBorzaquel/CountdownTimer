import React, { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInSeconds } from 'date-fns';
import uuid from 'react-native-uuid';

import {
  ButtonWrapper,
  Container, Footer, FooterContent, Header, HelpButtonWrapper, Name, Title, WarnMessage
} from './styles';
import { Alert, FlatList, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UIButton } from '../../components/UIButton';
import { EventCard } from '../../components/EventCard';
import { ListSeparator } from '../../components/ListSeparator';

export interface ITimer {
  eventId: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface IEvent {
  id: string;
  name: string;
  date: Date;
}

type TShowDateModel = 'hide' | 'date' | 'time';

export function Home() {
  const [showDateModal, setShowDateModal] = useState<TShowDateModel>('hide')

  const [date, setDate] = useState(new Date())
  const [name, setName] = useState('')
  const [warnMessage, setWarnMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const [events, setEvents] = useState([] as IEvent[])
  const [timers, setTimers] = useState([] as ITimer[])

  const asyncStorageKey = '@countdowntimer_events'

  async function getEvents() {
    try {
      const events = await AsyncStorage.getItem(asyncStorageKey)

      const eventsParse = JSON.parse(events || '[]') as IEvent[]

      const eventsFormatted = eventsParse.map(event => ({ ...event, date: new Date(event.date) }))

      return eventsFormatted
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function addEvents(newEvent: IEvent) {
    try {
      const events = await getEvents()
      const updatedEvents = [...events, newEvent]

      await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(updatedEvents))
      setEvents(updatedEvents)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  async function deleteEvents(id: string) {
    try {
      const events = await getEvents()

      const updatedEvents = events.filter(event => event.id !== id)

      await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(updatedEvents))
      setEvents(updatedEvents)
    } catch (error: any) {
      throw new Error(error)
    }
  }

  function onChangeDate(event: any, selectedDate: any) {
    setShowDateModal('hide')
    if (selectedDate) {
      const newDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        new Date().getSeconds(),
        0
      )
      setDate(newDate || date)
    }
  }

  function handleDateButtonPress(type: 'date' | 'time') {
    setShowDateModal(type)
  }

  function handleDeleteTime() {
    const newDate = new Date(date.setHours(0, 0, 0, 0))
    setDate(newDate)
  }

  function handleSetNow() {
    const newDate = new Date(
      new Date().setHours(date.getHours(), date.getMinutes(), date.getSeconds(), 0)
    )

    setDate(newDate)
  }

  async function handleAddEvent() {
    Keyboard.dismiss()
    try {
      if (name === '') return setWarnMessage('Você precisa colocar o nome do Evento!')
      if (new Date().valueOf() >= date.valueOf()) return setWarnMessage('A data atual é menor que a data escolhida')

      setWarnMessage('')

      const newEvent = { id: uuid.v4(), name, date, complete: false } as IEvent

      await addEvents(newEvent)
      setName('')
    } catch (error: any) {
      Alert.alert('Não foi possivel adicionar o evento!')
    }
  }

  async function handleDeleteEvent(event: IEvent) {
    try {
      Alert.alert(
        `DELETAR: ${event.name}`,
        `Essa ação não podera ser desfeita!`,
        [
          {
            text: 'Deletar',
            style: 'destructive',
            onPress: async () => await deleteEvents(event.id)
          },
          {
            text: 'Cancelar',
            style: 'cancel'
          }
        ]
      )

    } catch (error: any) {
      Alert.alert('Não foi possivel deletar o evento!')
    }
  }

  const convertTime = (time: number) => time <= 0 ? '00' : time.toString().padStart(2, '0')
  const getTimer = (id: string) => timers.find(timer => timer.eventId === id)

  const convertForSeconds = (value: number, constant: number) => Math.floor((value / constant))
  const convertInSeconds = (value: number, constant: number) => Math.floor((value * constant))
  const secondsConvertConstants = [86400, 3600, 60, 1] // [Days, Hours, Minutes, Seconds]
  const stopInterval = showDateModal !== 'hide' || events.length === 0

  const dateFormatted = () => `${convertTime(date.getDate())}/${convertTime(date.getMonth())}/${date.getFullYear()}`
  const timeFormatted = () => `${convertTime(date.getHours())}:${convertTime(date.getMinutes())}`

  useEffect(() => {
    let interval: NodeJS.Timer

    if (!stopInterval) {
      interval = setInterval(() => {
        const now = new Date()

        const updatedTimers = events.map(event => {
          const { date, id, name } = event

          if (date <= now) return { days: 0, hours: 0, minutes: 0, seconds: 0, eventId: id }

          let rest = differenceInSeconds(date, now)

          const updatedTimer = secondsConvertConstants.map(constant => {
            const diference = convertForSeconds(rest, constant)
            rest = rest - convertInSeconds(diference, constant)

            return diference || 0
          })


          const [days, hours, minutes, seconds] = updatedTimer

          if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            Alert.alert('O evento chegou!', name)
          }

          return { days, hours, minutes, seconds, eventId: id }
        })

        setTimers(updatedTimers)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [stopInterval, events])

  useEffect(() => {
    let isActive = true
    const ac = new AbortController()

    async function getStorageEvents() {
      try {
        const events = await getEvents()
        if (isActive) setEvents(events)
      } catch (error) {
        Alert.alert('Não foi possivel carregar os eventos!')
      } finally {
        setLoading(false)
      }
    }
    getStorageEvents()

    return () => {
      isActive = false
      ac.abort()
    }
  }, [])

  if (loading) return null
  return (
    <>
      <Container>
        <Header>
          <Title>Cronômetro de contagem regressiva</Title>
        </Header>

        <FlatList
          data={events.sort((a, b) => a.date.valueOf() - b.date.valueOf())}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <ListSeparator />}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <EventCard
              item={item}
              getTimer={getTimer}
              convertTime={convertTime}
              handleDeleteEvent={handleDeleteEvent}
            />
          )}
        />

        <Footer>
          <FooterContent>
            {!!warnMessage && <WarnMessage>{warnMessage}</WarnMessage>}
            <ButtonWrapper>
              <HelpButtonWrapper>
                <UIButton title="Hoje" onPress={handleSetNow} color="#e47e7e" />
              </HelpButtonWrapper>
              <UIButton title={dateFormatted()} description="Data:" onPress={() => handleDateButtonPress('date')} color="#86bdfc" />
            </ButtonWrapper>
            <ButtonWrapper>
              <HelpButtonWrapper>
                <UIButton title="Deletar Hora" onPress={handleDeleteTime} color="#e47e7e" />
              </HelpButtonWrapper>
              <UIButton title={timeFormatted()} description="Hora:" onPress={() => handleDateButtonPress('time')} color="#86bdfc" />
            </ButtonWrapper>
            <Name
              value={name}
              onChangeText={setName}
              autoCorrect={false}
              autoCapitalize="sentences"
              placeholder="Nome do evento"
            />
            <UIButton title="Adicionar evento" onPress={handleAddEvent} color="#77d477" />
          </FooterContent>
        </Footer>

      </Container>
      {showDateModal !== 'hide' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={showDateModal}
          is24Hour={true}
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
    </>
  );
}
