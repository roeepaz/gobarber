import React, { useState, useEffect, useCallback } from 'react';
import {
  FiCheck,
  FiX,
  FiClock,
  FiCalendar,
  FiUsers,
  FiPieChart,
  FiBarChart2,
  FiTrendingUp,
  FiPlus,
  FiTrash2,
  FiSun,
  FiWatch,
} from 'react-icons/fi';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { parseISO, format, isAfter, isSameDay } from 'date-fns';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  Container,
  Header,
  Content,
  StatsGrid,
  StatCard,
  Section,
  AppointmentList,
  AppointmentItem,
  SlotsSection,
  SlotForm,
  TimeInput,
  TabContainer,
  TabButton,
  SlotsList,
  SlotItem,
  TodaySection,
  TodayStatsGrid,
  TodayStatCard,
  TodayAppointmentsList,
  TodayAppointmentItem,
  TimelineSection,
  TimelineContainer,
  TimelineItem,
} from './styles';

interface Appointment {
  id: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  user: {
    name: string;
    avatar_url: string;
  };
}

interface Slot {
  id: string;
  date: string;
  is_available: boolean;
}

interface DashboardStats {
  totalAppointments: number;
  pendingAppointments: number;
  approvedAppointments: number;
  rejectedAppointments: number;
  cancelledAppointments: number;
  todayStats: {
    total: number;
    pending: number;
    approved: number;
  };
  weekStats: {
    total: number;
    pending: number;
    approved: number;
  };
  monthStats: {
    total: number;
    pending: number;
    approved: number;
  };
  slotUtilization: {
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    utilizationRate: number;
  };
}

interface TodayStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [activeTab, setActiveTab] = useState<'appointments' | 'slots'>('appointments');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async () => {
    const response = await api.get('/admin/appointments', {
      params: { status: statusFilter },
    });
    setAppointments(response.data);
  }, [statusFilter]);

  const fetchTodayAppointments = useCallback(async () => {
    const response = await api.get('/admin/appointments/today');
    setTodayAppointments(response.data.appointments);
    setTodayStats(response.data.stats);
  }, []);

  const fetchSlots = useCallback(async () => {
    const response = await api.get('/available-slots');
    setSlots(response.data);
  }, []);

  const fetchStats = useCallback(async () => {
    const response = await api.get('/admin/appointments/stats');
    setStats(response.data);
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchTodayAppointments();
    fetchSlots();
    fetchStats();
  }, [fetchAppointments, fetchTodayAppointments, fetchSlots, fetchStats]);

  const handleApprove = async (appointmentId: string) => {
    await api.patch(`/admin/appointments/${appointmentId}/approve`);
    fetchAppointments();
    fetchTodayAppointments();
    fetchStats();
  };

  const handleReject = async (appointmentId: string) => {
    await api.patch(`/admin/appointments/${appointmentId}/reject`);
    fetchAppointments();
    fetchTodayAppointments();
    fetchStats();
  };

  const handleCreateSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const response = await api.post('/available-slots', {
        date: selectedDate,
        startTime,
        endTime,
        intervalMinutes: 20,
      });
      alert(`${response.data.count} time slots created successfully!`);
      setSelectedDate(undefined);
      fetchSlots();
      fetchStats();
    } catch (error) {
      const err = error as any;
      alert(err.response?.data?.message || 'Error creating time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      await api.delete(`/available-slots/${slotId}`);
      fetchSlots();
      fetchStats();
    } catch (error) {
      const err = error as any;
      alert(err.response?.data?.message || 'Error deleting slot');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FiCheck color="#2ecc71" />;
      case 'rejected':
        return <FiX color="#e74c3c" />;
      case 'cancelled':
        return <FiX color="#95a5a6" />;
      case 'pending':
        return <FiClock color="#f39c12" />;
      default:
        return null;
    }
  };

  const formatSlotDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'PPP p');
  };

  const formatTimeOnly = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };

  // Get today's slots for timeline view
  const getTodaySlots = () => {
    const today = new Date();
    return slots.filter(slot => isSameDay(parseISO(slot.date), today));
  };

  // Combine appointments and slots for timeline
  const getTimelineItems = () => {
    const todaySlots = getTodaySlots();
    const items = [
      ...todayAppointments.map(app => ({
        type: 'appointment' as const,
        id: app.id,
        date: app.date,
        title: app.user.name,
        subtitle: 'Appointment',
        status: app.status,
      })),
      ...todaySlots.map(slot => ({
        type: 'slot' as const,
        id: slot.id,
        date: slot.date,
        title: 'Available Slot',
        subtitle: slot.is_available ? 'Open' : 'Booked',
        status: slot.is_available ? 'available' : 'booked',
      })),
    ];

    return items.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  return (
    <Container>
      <Header>
        <h1>Admin Dashboard</h1>
        <div>
          <span>Welcome, {user.name}</span>
          <button type="button" onClick={signOut}>
            Sign Out
          </button>
        </div>
      </Header>

      <Content>
        {/* Statistics Cards */}
        {stats && (
          <StatsGrid>
            <StatCard color="#3498db">
              <FiCalendar size={24} />
              <div>
                <strong>{stats.todayStats.total}</strong>
                <span>Today's Appointments</span>
              </div>
            </StatCard>
            <StatCard color="#f39c12">
              <FiClock size={24} />
              <div>
                <strong>{stats.pendingAppointments}</strong>
                <span>Pending</span>
              </div>
            </StatCard>
            <StatCard color="#2ecc71">
              <FiCheck size={24} />
              <div>
                <strong>{stats.approvedAppointments}</strong>
                <span>Approved</span>
              </div>
            </StatCard>
            <StatCard color="#e74c3c">
              <FiX size={24} />
              <div>
                <strong>{stats.rejectedAppointments}</strong>
                <span>Rejected</span>
              </div>
            </StatCard>
            <StatCard color="#9b59b6">
              <FiPieChart size={24} />
              <div>
                <strong>{stats.slotUtilization.utilizationRate}%</strong>
                <span>Slot Utilization</span>
              </div>
            </StatCard>
            <StatCard color="#1abc9c">
              <FiBarChart2 size={24} />
              <div>
                <strong>{stats.totalAppointments}</strong>
                <span>Total Appointments</span>
              </div>
            </StatCard>
          </StatsGrid>
        )}

        {/* Today's Schedule Section */}
        <TodaySection>
          <h2>
            <FiSun /> Today's Schedule - {format(new Date(), 'PPP')}
          </h2>
          {todayStats && (
            <TodayStatsGrid>
              <TodayStatCard>
                <strong>{todayStats.total}</strong>
                <span>Total</span>
              </TodayStatCard>
              <TodayStatCard>
                <strong>{todayStats.pending}</strong>
                <span>Pending</span>
              </TodayStatCard>
              <TodayStatCard>
                <strong>{todayStats.approved}</strong>
                <span>Approved</span>
              </TodayStatCard>
              <TodayStatCard>
                <strong>{todayStats.rejected + todayStats.cancelled}</strong>
                <span>Rejected/Cancelled</span>
              </TodayStatCard>
            </TodayStatsGrid>
          )}
          
          {todayAppointments.length === 0 ? (
            <p className="empty">No appointments scheduled for today</p>
          ) : (
            <TodayAppointmentsList>
              {todayAppointments.map(appointment => (
                <TodayAppointmentItem key={appointment.id} status={appointment.status}>
                  <div className="time">
                    <FiWatch />
                    {formatTimeOnly(appointment.date)}
                  </div>
                  <div className="info">
                    <div className="user-name">{appointment.user.name}</div>
                    <span className={`status ${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                  {appointment.status === 'pending' && (
                    <div className="actions">
                      <button
                        type="button"
                        className="approve"
                        onClick={() => handleApprove(appointment.id)}
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        type="button"
                        className="reject"
                        onClick={() => handleReject(appointment.id)}
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  )}
                </TodayAppointmentItem>
              ))}
            </TodayAppointmentsList>
          )}
        </TodaySection>

        {/* Timeline View Section */}
        <TimelineSection>
          <h2>
            <FiClock /> Today's Timeline View
          </h2>
          {getTimelineItems().length === 0 ? (
            <p className="empty">No appointments or slots scheduled for today</p>
          ) : (
            <TimelineContainer>
              {getTimelineItems().map(item => (
                <TimelineItem key={item.id} type={item.type as 'appointment' | 'slot'}>
                  <div className="time">{formatTimeOnly(item.date)}</div>
                  <div className="content">
                    <div className="indicator" />
                    <div className="details">
                      <div className="title">{item.title}</div>
                      <div className="subtitle">{item.subtitle}</div>
                    </div>
                  </div>
                  <span className={`status-badge ${item.status}`}>
                    {item.status}
                  </span>
                </TimelineItem>
              ))}
            </TimelineContainer>
          )}
        </TimelineSection>

        {/* Create Slots Section */}
        <SlotsSection>
          <h2>
            <FiPlus /> Create Available Time Slots
          </h2>
          <SlotForm>
            <div className="calendar-section">
              <DayPicker
                onDayClick={setSelectedDate}
                selectedDays={selectedDate}
                disabledDays={{ before: new Date() }}
              />
            </div>
            {selectedDate && (
              <div className="time-section">
                <p>Selected: {format(selectedDate, 'PPP')}</p>
                <TimeInput>
                  <label>
                    Start Time:
                    <input
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                    />
                  </label>
                  <label>
                    End Time:
                    <input
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                    />
                  </label>
                </TimeInput>
                <p className="info">
                  Will create slots every 20 minutes from {startTime} to {endTime}
                </p>
                <button
                  type="button"
                  onClick={handleCreateSlots}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Slots'}
                </button>
              </div>
            )}
          </SlotForm>
        </SlotsSection>

        {/* Tabs */}
        <TabContainer>
          <TabButton
            active={activeTab === 'appointments'}
            onClick={() => setActiveTab('appointments')}
          >
            <FiUsers /> All Appointments
          </TabButton>
          <TabButton
            active={activeTab === 'slots'}
            onClick={() => setActiveTab('slots')}
          >
            <FiCalendar /> Available Slots ({slots.length})
          </TabButton>
        </TabContainer>

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <Section>
            <h2>All Appointment Requests</h2>
            <div className="filter">
              <label>Filter by status:</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="">All</option>
              </select>
            </div>

            <AppointmentList>
              {appointments.length === 0 ? (
                <p className="empty">No appointments found</p>
              ) : (
                appointments.map(appointment => (
                  <AppointmentItem key={appointment.id} status={appointment.status}>
                    <div className="info">
                      <div className="datetime">
                        <FiCalendar />
                        <span>
                          {format(parseISO(appointment.date), 'PPP p')}
                        </span>
                      </div>
                      <div className="user">
                        <span>User: {appointment.user.name}</span>
                      </div>
                      <div className="status">
                        {getStatusIcon(appointment.status)}
                        <span className={appointment.status}>{appointment.status}</span>
                      </div>
                    </div>
                    {appointment.status === 'pending' && (
                      <div className="actions">
                        <button
                          type="button"
                          className="approve"
                          onClick={() => handleApprove(appointment.id)}
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          type="button"
                          className="reject"
                          onClick={() => handleReject(appointment.id)}
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    )}
                  </AppointmentItem>
                ))
              )}
            </AppointmentList>
          </Section>
        )}

        {/* Slots Tab */}
        {activeTab === 'slots' && (
          <Section>
            <h2>Available Time Slots</h2>
            <SlotsList>
              {slots.length === 0 ? (
                <p className="empty">No slots created yet</p>
              ) : (
                slots.map(slot => (
                  <SlotItem key={slot.id} available={slot.is_available}>
                    <div className="info">
                      <FiCalendar />
                      <span>{formatSlotDate(slot.date)}</span>
                      <span className={`badge ${slot.is_available ? 'available' : 'booked'}`}>
                        {slot.is_available ? 'Available' : 'Booked'}
                      </span>
                    </div>
                    {slot.is_available && (
                      <button
                        type="button"
                        className="delete"
                        onClick={() => handleDeleteSlot(slot.id)}
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </SlotItem>
                ))
              )}
            </SlotsList>
          </Section>
        )}
      </Content>
    </Container>
  );
};

export default AdminDashboard;
