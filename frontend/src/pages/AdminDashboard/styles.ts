import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: ${props => props.theme.colors.primary};
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    font-size: 28px;
    font-weight: 700;
  }

  > div {
    display: flex;
    align-items: center;
    gap: 16px;

    span {
      font-size: 16px;
    }

    button {
      background: transparent;
      border: 2px solid #fff;
      color: #fff;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.15);
        transform: translateY(-1px);
      }
    }
  }
`;

export const Content = styled.main`
  flex: 1;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 8px;
`;

interface StatCardProps {
  color: string;
}

export const StatCard = styled.div<StatCardProps>`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid ${props => props.color};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  svg {
    color: ${props => props.color};
    flex-shrink: 0;
  }

  > div {
    display: flex;
    flex-direction: column;

    strong {
      font-size: 28px;
      color: ${props => props.theme.colors.text};
      font-weight: 700;
    }

    span {
      font-size: 14px;
      color: ${props => props.theme.colors.text};
      opacity: 0.8;
    }
  }
`;

export const Section = styled.section`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text};
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .filter {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;

    label {
      color: ${props => props.theme.colors.text};
      font-weight: 500;
    }

    select {
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid ${props => props.theme.colors.disabled};
      background: ${props => props.theme.colors.background};
      color: ${props => props.theme.colors.text};
      font-size: 14px;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
      }
    }
  }

  .empty {
    text-align: center;
    padding: 40px;
    color: ${props => props.theme.colors.text};
    opacity: 0.6;
    font-style: italic;
  }
`;

export const SlotsSection = styled(Section)`
  h2 {
    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

export const SlotForm = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .calendar-section {
    .DayPicker {
      background: ${props => props.theme.colors.background};
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }

  .time-section {
    display: flex;
    flex-direction: column;
    gap: 16px;

    p {
      color: ${props => props.theme.colors.text};
      font-weight: 500;
    }

    .info {
      font-size: 14px;
      color: ${props => props.theme.colors.text};
      opacity: 0.7;
      font-style: italic;
    }

    button {
      background: ${props => props.theme.colors.primary};
      color: #fff;
      border: none;
      padding: 14px 28px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;

export const TimeInput = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
    font-weight: 500;

    input {
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid ${props => props.theme.colors.disabled};
      background: ${props => props.theme.colors.background};
      color: ${props => props.theme.colors.text};
      font-size: 16px;

      &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
      }
    }
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid ${props => props.theme.colors.disabled};
  padding-bottom: 2px;
`;

interface TabButtonProps {
  active: boolean;
}

export const TabButton = styled.button<TabButtonProps>`
  background: ${props => (props.active ? props.theme.colors.primary : 'transparent')};
  color: ${props => (props.active ? '#fff' : props.theme.colors.text)};
  border: none;
  padding: 12px 24px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: ${props => (props.active ? 600 : 500)};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props =>
      props.active ? props.theme.colors.primary : props.theme.colors.disabled};
    opacity: 0.8;
  }

  svg {
    font-size: 18px;
  }
`;

export const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface AppointmentItemProps {
  status: string;
}

export const AppointmentItem = styled.div<AppointmentItemProps>`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.disabled};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'approved':
        return '#2ecc71';
      case 'rejected':
        return '#e74c3c';
      case 'pending':
        return '#f39c12';
      default:
        return props.theme.colors.disabled;
    }
  }};

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;

    .datetime,
    .user,
    .status {
      display: flex;
      align-items: center;
      gap: 8px;
      color: ${props => props.theme.colors.text};

      svg {
        flex-shrink: 0;
        color: ${props => props.theme.colors.primary};
      }
    }

    .status {
      span {
        text-transform: capitalize;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;

        &.pending {
          background: rgba(243, 156, 18, 0.15);
          color: #f39c12;
        }

        &.approved {
          background: rgba(46, 204, 113, 0.15);
          color: #2ecc71;
        }

        &.rejected {
          background: rgba(231, 76, 60, 0.15);
          color: #e74c3c;
        }
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;

    button {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: all 0.2s;

      &.approve {
        background: #2ecc71;
        color: #fff;

        &:hover {
          background: #27ae60;
        }
      }

      &.reject {
        background: #e74c3c;
        color: #fff;

        &:hover {
          background: #c0392b;
        }
      }
    }
  }
`;

export const SlotsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 500px;
  overflow-y: auto;
`;

interface SlotItemProps {
  available: boolean;
}

export const SlotItem = styled.div<SlotItemProps>`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.disabled};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .info {
    display: flex;
    align-items: center;
    gap: 12px;

    svg {
      color: ${props => props.theme.colors.primary};
    }

    span {
      color: ${props => props.theme.colors.text};
    }

    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;

      &.available {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
      }

      &.booked {
        background: rgba(149, 165, 166, 0.15);
        color: #7f8c8d;
      }
    }
  }

  button.delete {
    background: transparent;
    border: none;
    color: #e74c3c;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      background: rgba(231, 76, 60, 0.1);
    }

    svg {
      font-size: 18px;
    }
  }
`;

// Today's Schedule Section Styles
export const TodaySection = styled.section`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid ${props => props.theme.colors.primary};

  h2 {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.primary};
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const TodayStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const TodayStatCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  border: 1px solid ${props => props.theme.colors.disabled};

  strong {
    display: block;
    font-size: 24px;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 4px;
  }

  span {
    font-size: 12px;
    color: ${props => props.theme.colors.text};
    opacity: 0.8;
  }
`;

export const TodayAppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
`;

export const TodayAppointmentItem = styled.div<{ status: string }>`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.disabled};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'approved':
        return '#2ecc71';
      case 'rejected':
        return '#e74c3c';
      case 'pending':
        return '#f39c12';
      default:
        return props.theme.colors.disabled;
    }
  }};

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .time {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 100px;
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    font-size: 16px;

    svg {
      color: ${props => props.theme.colors.primary};
    }
  }

  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .user-name {
      font-weight: 600;
      color: ${props => props.theme.colors.text};
    }

    .status {
      font-size: 12px;
      text-transform: capitalize;
      font-weight: 500;
      padding: 2px 10px;
      border-radius: 12px;
      display: inline-block;
      width: fit-content;

      &.pending {
        background: rgba(243, 156, 18, 0.15);
        color: #f39c12;
      }

      &.approved {
        background: rgba(46, 204, 113, 0.15);
        color: #2ecc71;
      }

      &.rejected {
        background: rgba(231, 76, 60, 0.15);
        color: #e74c3c;
      }

      &.cancelled {
        background: rgba(149, 165, 166, 0.15);
        color: #7f8c8d;
      }
    }
  }

  .actions {
    display: flex;
    gap: 8px;

    button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      font-size: 12px;
      transition: all 0.2s;

      &.approve {
        background: #2ecc71;
        color: #fff;

        &:hover {
          background: #27ae60;
        }
      }

      &.reject {
        background: #e74c3c;
        color: #fff;

        &:hover {
          background: #c0392b;
        }
      }
    }
  }
`;

// Timeline View Styles
export const TimelineSection = styled.section`
  background: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  h2 {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text};
    font-size: 20px;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

export const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
`;

export const TimelineItem = styled.div<{ type: 'appointment' | 'slot' }>`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${props =>
    props.type === 'appointment'
      ? 'rgba(52, 152, 219, 0.1)'
      : props.theme.colors.background};
  border: 1px solid ${props =>
    props.type === 'appointment'
      ? 'rgba(52, 152, 219, 0.3)'
      : props.theme.colors.disabled};

  .time {
    min-width: 80px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    font-size: 14px;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;

    .indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: ${props =>
        props.type === 'appointment' ? '#3498db' : '#95a5a6'};
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .title {
        font-weight: 600;
        color: ${props => props.theme.colors.text};
      }

      .subtitle {
        font-size: 12px;
        color: ${props => props.theme.colors.text};
        opacity: 0.7;
      }
    }
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;

    &.pending {
      background: rgba(243, 156, 18, 0.15);
      color: #f39c12;
    }

    &.approved {
      background: rgba(46, 204, 113, 0.15);
      color: #2ecc71;
    }

    &.rejected {
      background: rgba(231, 76, 60, 0.15);
      color: #e74c3c;
    }

    &.available {
      background: rgba(149, 165, 166, 0.15);
      color: #7f8c8d;
    }
  }
`;
