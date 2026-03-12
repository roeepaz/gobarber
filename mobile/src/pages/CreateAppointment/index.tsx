import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { Platform, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { format, setHours, setMinutes } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useAuth } from '../../hooks/auth';
import { IProvider } from '../Dashboard';
import api from '../../services/api';

import * as S from './styles';

interface IRouteParams {
  providerId: string;
}

interface IAvailabilityItem {
  hour: number;
  minute: number;
  available: boolean;
}

interface ISelectedSlot {
  hour: number;
  minute: number;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const { user } = useAuth();
  const { goBack, navigate } = useNavigation();
  const [availability, setAvailability] = useState<IAvailabilityItem[]>([]);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<ISelectedSlot | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  const nameInitials = useMemo(() => {
    return user.name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }, [user.name]);

  useEffect(() => {
    api.get<IProvider[]>('providers').then(response => {
      setProviders(
        response.data.map(provider =>
          provider.avatar_url
            ? provider
            : {
                ...provider,
                nameInitials: provider.name
                  .split(' ')
                  .map(name => name.charAt(0).toUpperCase())
                  .join('')
                  .substring(0, 2),
              },
        ),
      );
    });
  }, []);

  useEffect(() => {
    api
      .get(`providers/${selectedProvider}/day-availability`, {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        setAvailability(response.data);
        setSelectedSlot(null); // Reset selected slot when date changes
      });
  }, [selectedDate, selectedProvider]);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(oldValue => !oldValue);
  }, []);

  const handleChangeDate = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDatePicker(false);

    if (date) setSelectedDate(date);
  }, []);

  const handleSelectSlot = useCallback((hour: number, minute: number) => {
    setSelectedSlot({ hour, minute });
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    if (!selectedSlot) {
      Alert.alert('Selecione um horário', 'Por favor, selecione um horário disponível');
      return;
    }

    try {
      const date = new Date(selectedDate);
      date.setHours(selectedSlot.hour);
      date.setMinutes(selectedSlot.minute);
      date.setSeconds(0);

      await api.post('appointments', {
        provider_id: selectedProvider,
        date,
      });

      navigate('AppointmentCreated', { date: date.getTime() });
    } catch (error) {
      Alert.alert(
        'erro ao criar agendamento',
        'Ocorreu um erro ao tentar criar o agendamento, tente novamente',
      );
    }
  }, [navigate, selectedSlot, selectedProvider, selectedDate]);

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, minute, available }) => ({
        hour,
        minute,
        available,
        formattedHour: format(
          setMinutes(setHours(new Date(), hour), minute),
          'HH:mm',
        ),
      }));
  }, [availability]);

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, minute, available }) => ({
        hour,
        minute,
        available,
        formattedHour: format(
          setMinutes(setHours(new Date(), hour), minute),
          'HH:mm',
        ),
      }));
  }, [availability]);

  const isSlotSelected = useCallback(
    (hour: number, minute: number) => {
      return selectedSlot?.hour === hour && selectedSlot?.minute === minute;
    },
    [selectedSlot],
  );

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </S.BackButton>

        <S.HeaderTitle>Cabeleireiros</S.HeaderTitle>

        {user.avatar_url ? (
          <S.UserAvatar source={{ uri: user.avatar_url }} />
        ) : (
          <S.UserInitialsContainer>
            <S.UserInitials>{nameInitials}</S.UserInitials>
          </S.UserInitialsContainer>
        )}
      </S.Header>

      <S.Content>
        <S.ProvidersListContainer>
          <S.ProvidersList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={providers}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <S.ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                {provider.avatar_url ? (
                  <S.ProviderAvatar
                    selected={provider.id === selectedProvider}
                    source={{ uri: provider.avatar_url }}
                  />
                ) : (
                  <S.ProviderInitialsContainer
                    selected={provider.id === selectedProvider}
                  >
                    <S.ProviderInitials>
                      {provider.nameInitials}
                    </S.ProviderInitials>
                  </S.ProviderInitialsContainer>
                )}
                <S.ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </S.ProviderName>
              </S.ProviderContainer>
            )}
          />
        </S.ProvidersListContainer>

        <S.Calendar>
          <S.Title>Escolha a data</S.Title>

          <S.OpenDatePickerButton onPress={handleToggleDatePicker}>
            <S.OpenDatePickerButtonText>
              Selecionar outra data
            </S.OpenDatePickerButtonText>
          </S.OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              textColor="#f4ede8"
              value={selectedDate}
              onChange={handleChangeDate}
            />
          )}
        </S.Calendar>

        <S.Schedule>
          <S.Title>Escolha o horário</S.Title>

          {morningAvailability.length > 0 && (
            <S.Section>
              <S.SectionTitle>Manhã</S.SectionTitle>

              <S.SectionContent>
                {morningAvailability.map(({ formattedHour, available, hour, minute }) => (
                  <S.Hour
                    enabled={available}
                    selected={isSlotSelected(hour, minute)}
                    onPress={() => handleSelectSlot(hour, minute)}
                    available={available}
                    key={formattedHour}
                  >
                    <S.HourText selected={isSlotSelected(hour, minute)}>
                      {formattedHour}
                    </S.HourText>
                  </S.Hour>
                ))}
              </S.SectionContent>
            </S.Section>
          )}

          {afternoonAvailability.length > 0 && (
            <S.Section>
              <S.SectionTitle>Tarde</S.SectionTitle>

              <S.SectionContent>
                {afternoonAvailability.map(
                  ({ formattedHour, available, hour, minute }) => (
                    <S.Hour
                      enabled={available}
                      selected={isSlotSelected(hour, minute)}
                      onPress={() => handleSelectSlot(hour, minute)}
                      available={available}
                      key={formattedHour}
                    >
                      <S.HourText selected={isSlotSelected(hour, minute)}>
                        {formattedHour}
                      </S.HourText>
                    </S.Hour>
                  ),
                )}
              </S.SectionContent>
            </S.Section>
          )}

          {availability.length === 0 && (
            <S.Section>
              <S.SectionTitle>Nenhum horário disponível</S.SectionTitle>
            </S.Section>
          )}
        </S.Schedule>

        <S.CreateAppointmentButton onPress={handleCreateAppointment}>
          <S.CreateAppointmentButtonText>Agendar</S.CreateAppointmentButtonText>
        </S.CreateAppointmentButton>
      </S.Content>
    </S.Container>
  );
};

export default CreateAppointment;
