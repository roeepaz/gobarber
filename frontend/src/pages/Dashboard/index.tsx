import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { isToday, format, parseISO, isAfter, isSameDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { FiPower, FiClock, FiCalendar, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { FaMoon, FaSun } from 'react-icons/fa';
import Toggle from 'react-toggle';
import { ThemeContext } from 'styled-components';
import { Link } from 'react-router-dom';
import logoLight from '../../assets/logo-light.svg';
import logo from '../../assets/logo.svg';
import { useTheme } from '../../hooks/theme';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Avatar,
  Content,
  Schedule,
  NextAppointment,
  Section,
  Appointment,
  Initials,
  Calendar,
  AvailableSlotsSection,
  SlotList,
  SlotItem,
  BookButton,
  BookingMessage,
  StatusBadge,
} from './styles';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  provider: {
    name: string;
    avatar_url: string;
  };
}

interface AvailableSlot {
  id: string;
  date: string;
  is_available: boolean;
  admin_id: string;
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { title } = useContext(ThemeContext);
  const { toggleTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available && !modifiers.disabled) {
      setSelectedDate(day);
    }
  }, []);

  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  // Fetch user's appointments
  const fetchAppointments = useCallback(() => {
    api
      .get<Appointment[]>('/user/appointments', {
        params: {
          day: selectedDate.getDate(),
          month: selectedDate.getMonth() + 1,
          year: selectedDate.getFullYear(),
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
            provider: {
              ...appointment.provider,
              avatar_url:
                appointment.provider.avatar_url ??
                appointment.provider.name
                  .split(' ')
                  .map(name => name.charAt(0).toUpperCase())
                  .join('')
                  .substring(0, 2),
            },
          };
        });
        setAppointments(formattedAppointments);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      });
  }, [selectedDate]);

  // Fetch available slots
  const fetchAvailableSlots = useCallback(() => {
    api
      .get<AvailableSlot[]>('/available-slots')
      .then(response => {
        setAvailableSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching available slots:', error);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          month: currentMonth.getMonth() + 1,
          year: currentMonth.getFullYear(),
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Fetch available slots on component mount
  useEffect(() => {
    fetchAvailableSlots();
  }, [fetchAvailableSlots]);

  // Clear booking message after 3 seconds
  useEffect(() => {
    if (bookingMessage) {
      const timer = setTimeout(() => {
        setBookingMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingMessage]);

  // Handle booking a slot
  const handleBookSlot = useCallback(async (slot: AvailableSlot) => {
    setBookingLoading(slot.id);
    setBookingMessage(null);

    try {
      // Find the admin (provider) for this slot
      const provider_id = slot.admin_id;
      const date = slot.date;

      await api.post('/appointments', {
        provider_id,
        date,
      });

      setBookingMessage({
        type: 'success',
        text: 'Appointment requested! Waiting for admin approval.',
      });

      // Refresh available slots and appointments
      fetchAvailableSlots();
      fetchAppointments();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error booking appointment. Please try again.';
      setBookingMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setBookingLoading(null);
    }
  }, [fetchAvailableSlots, fetchAppointments]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Day' dd 'of' MMMM", {
      locale: enUS,
    });
  }, [selectedDate]);

  const selectedWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: enUS,
    });
  }, [selectedDate]);

  // Helper function to map backend status to display status
  const getDisplayStatus = useCallback(
    (status: 'pending' | 'approved' | 'rejected' | 'cancelled') => {
      switch (status) {
        case 'approved':
          return 'confirmed';
        case 'rejected':
          return 'cancelled';
        default:
          return status;
      }
    },
    [],
  );

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment =>
      isAfter(parseISO(appointment.date), new Date()),
    );
  }, [appointments]);

  // Filter slots for the selected date
  const slotsForSelectedDate = useMemo(() => {
    return availableSlots.filter(slot => {
      const slotDate = parseISO(slot.date);
      return isSameDay(slotDate, selectedDate) && slot.is_available;
    }).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [availableSlots, selectedDate]);

  // Group slots by time period (morning/afternoon)
  const morningSlots = useMemo(() => {
    return slotsForSelectedDate.filter(slot => {
      return parseISO(slot.date).getHours() < 12;
    });
  }, [slotsForSelectedDate]);

  const afternoonSlots = useMemo(() => {
    return slotsForSelectedDate.filter(slot => {
      return parseISO(slot.date).getHours() >= 12;
    });
  }, [slotsForSelectedDate]);

  const nameInitials = useMemo(() => {
    return user.name
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }, [user.name]);

  const formatSlotTime = (dateString: string) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  return (
    <Container>
      <Header>
        <HeaderContent>
          {title === 'light' ? (
            <img src={logoLight} alt="GoBarber" />
          ) : (
            <img src={logo} alt="GoBarber" />
          )}

          <Profile>
            <Avatar>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <p>{nameInitials}</p>
              )}
            </Avatar>

            <div>
              <span>Welcome,</span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>

          <Toggle
            checked={title === 'dark'}
            onChange={toggleTheme}
            className="toggle"
            icons={{
              checked: <FaMoon color="yellow" size={12} />,
              unchecked: <FaSun color="yellow" size={12} />,
            }}
          />

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>Scheduled appointments</h1>
          <p>
            {isToday(selectedDate) && <span>Today</span>}
            <span>{selectedDateAsText}</span>
            <span>{selectedWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>Next appointment</strong>

              <div>
                {/*{nextAppointment.provider.avatar_url.length === 2 ? (
                //  <Initials>
              //      <span>{nextAppointment.provider.avatar_url}</span>
            //      </Initials>
          //      ) : (
        //          <img
      //              src={nextAppointment.provider.avatar_url}
    //                alt={nextAppointment.provider.name}
  //                />
//                )}

                */}


                <strong>{nextAppointment.provider.name}</strong>
                <StatusBadge status={getDisplayStatus(nextAppointment.status)}>
                  {getDisplayStatus(nextAppointment.status)}
                </StatusBadge>
                <span>
                  <FiClock />
                  {nextAppointment.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}
          <Section>
            <strong>Appointments for {selectedDateAsText}</strong>

            {!appointments.length && (
              <p>No appointments for this day</p>
            )}

            {appointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span className="date">
                  {format(parseISO(appointment.date), 'MMM dd, yyyy')}
                </span>
                <span className="hour">
                  <FiClock />
                  {appointment.formattedHour}
                </span>
                <div>
                  {/*{appointment.provider.avatar_url.length === 2 ? (
                    <Initials>
                      <span>{appointment.provider.avatar_url}</span>
                    </Initials>
                  ) : (
                    <img
                      src={appointment.provider.avatar_url}
                      alt={appointment.provider.name}
                    />
                  )}

                  */}
                  
                  <strong>{appointment.provider.name}</strong>
                  <StatusBadge
                    status={getDisplayStatus(appointment.status)}
                  >
                    {getDisplayStatus(appointment.status)}
                  </StatusBadge>
                </div>
              </Appointment>
            ))}
          </Section>

          {/* Available Slots Section */}
          <AvailableSlotsSection>
            <h2>
              <FiCalendar />
              Available Slots for Booking
            </h2>

            {bookingMessage && (
              <BookingMessage type={bookingMessage.type}>
                {bookingMessage.type === 'success' ? <FiCheckCircle /> : <FiClock />}
                {bookingMessage.text}
              </BookingMessage>
            )}

            {slotsForSelectedDate.length === 0 ? (
              <p className="empty">No available slots for this date</p>
            ) : (
              <>
                {morningSlots.length > 0 && (
                  <SlotList>
                    <strong>Morning Slots</strong>
                    {morningSlots.map(slot => (
                      <SlotItem key={slot.id}>
                        <span className="time">
                          <FiClock />
                          {formatSlotTime(slot.date)}
                        </span>
                        <BookButton
                          onClick={() => handleBookSlot(slot)}
                          disabled={bookingLoading === slot.id}
                        >
                          {bookingLoading === slot.id ? (
                            <>
                              <FiLoader className="spin" /> Booking...
                            </>
                          ) : (
                            'Book Now'
                          )}
                        </BookButton>
                      </SlotItem>
                    ))}
                  </SlotList>
                )}

                {afternoonSlots.length > 0 && (
                  <SlotList>
                    <strong>Afternoon Slots</strong>
                    {afternoonSlots.map(slot => (
                      <SlotItem key={slot.id}>
                        <span className="time">
                          <FiClock />
                          {formatSlotTime(slot.date)}
                        </span>
                        <BookButton
                          onClick={() => handleBookSlot(slot)}
                          disabled={bookingLoading === slot.id}
                        >
                          {bookingLoading === slot.id ? (
                            <>
                              <FiLoader className="spin" /> Booking...
                            </>
                          ) : (
                            'Book Now'
                          )}
                        </BookButton>
                      </SlotItem>
                    ))}
                  </SlotList>
                )}
              </>
            )}
          </AvailableSlotsSection>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={['D', 'S', 'T', 'Q', 'Q', 'S', 'S']}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            selectedDays={selectedDate}
            onMonthChange={handleMonthChange}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onDayClick={handleDateChange}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Desembro',
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
