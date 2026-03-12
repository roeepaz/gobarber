import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div``;

export const Header = styled.header`
  padding: 32px 0;
  background: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0px 0px 10px -4px rgba(0, 0, 0, 0.2);
`;

export const HeaderContent = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  align-items: center;

  > img {
    height: 80px;
  }

  div.react-toggle {
    margin-left: auto;
    margin-right: 15px;
  }

  button {
    background: transparent;
    border: 0;

    svg {
      color: ${({ theme }) => theme.colors.text};
      width: 20px;
      height: 20px;

      :hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    }
  }
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 80px;

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;
  }

  span {
    color: ${({ theme }) => theme.colors.welcome};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Avatar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #312e38;

  img {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 50%;
    border-width: ${({ theme }) => (theme.title === 'dark' ? '3px' : '0')};
    border-style: solid;
    border-color: ${({ theme }) => theme.colors.primary};
    border-image: initial;
  }

  p {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 24px;
  }
`;

export const Content = styled.main`
  max-width: 1120px;
  margin: 64px auto;
  display: flex;
`;

export const Schedule = styled.div`
  flex: 1; /* ocupar todo o espaço - o espaço ocupado pelos 'irmãos' */
  margin-right: 120px;

  h1 {
    font-size: 36px;
    color: ${({ theme }) => theme.colors.title};
  }

  p {
    margin-top: 8px;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    font-weight: 500;

    span {
      display: flex;
      align-items: center;
    }

    span + span::before {
      content: '';
      width: 1px;
      height: 12px;
      background: ${({ theme }) => theme.colors.primary};
      margin: 0 8px;
    }
  }
`;

export const NextAppointment = styled.div`
  margin-top: 64px;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
    font-weight: 400;
  }

  > div {
    background: ${({ theme }) =>
      theme.title === 'light' ? '#fff' : '#3e3b47'};
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-radius: 10px;
    margin-top: 24px;
    position: relative;
    transition: transform 0.2s;

    ${({ theme }) =>
      theme.title === 'light' &&
      css`
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.2);
      `};

    &::before {
      content: '';
      background: ${({ theme }) => theme.colors.primary};
      height: 80%;
      width: 1px;
      position: absolute;
      left: 0;
      top: 10%;
    }

    &:hover {
      transform: translateX(10px);
    }

    > img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    > strong {
      margin-left: 24px;
      color: ${({ theme }) => theme.colors.title};
    }

    > span {
      margin-left: auto;
      display: flex;
      align-items: center;
      color: ${({ theme }) => theme.colors.text};

      > svg {
        color: ${({ theme }) => theme.colors.primary};
        margin-right: 8px;
      }
    }
  }
`;

export const Section = styled.section`
  margin-top: 48px;

  > strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 20px;
    line-height: 26px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.cardBackground};
    display: block;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  > p {
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const Appointment = styled.div`
  display: flex;
  align-items: center;

  & + div {
    margin-top: 20px;
  }

  > span.date {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.title};
    width: 120px;
    font-weight: 500;
    font-size: 14px;
  }

  > span.hour {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.welcome};
    width: 80px;
    margin-left: 16px;

    svg {
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 8px;
    }
  }

  > div {
    display: flex;
    flex: 1;
    align-items: center;
    background: ${({ theme }) => theme.colors.secondary};
    padding: 16px 24px;
    margin-left: 24px;
    border-radius: 10px;
    ${({ theme }) =>
      theme.title === 'light' &&
      css`
        border: 1px solid #222;
      `};

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }

    strong {
      margin-left: 24px;
      color: ${({ theme }) => theme.colors.title};
      font-size: 20px;
    }
  }
`;

export const Initials = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background};

  > span {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 24px;
  }
`;

export const StatusBadge = styled.span<{
  status: 'pending' | 'confirmed' | 'cancelled';
}>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: auto;
  margin-right: 12px;

  ${({ status }) => {
    switch (status) {
      case 'pending':
        return `
          background: #f1c40f;
          color: #7d6608;
        `;
      case 'confirmed':
        return `
          background: #2ecc71;
          color: #145a32;
        `;
      case 'cancelled':
        return `
          background: #95a5a6;
          color: #2c3e50;
        `;
      default:
        return '';
    }
  }}
`;

export const AvailableSlotsSection = styled.div`
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid ${({ theme }) => theme.colors.cardBackground};

  h2 {
    color: ${({ theme }) => theme.colors.title};
    font-size: 24px;
    margin-bottom: 24px;
    display: flex;
    align-items: center;

    svg {
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 12px;
    }
  }

  .empty {
    color: ${({ theme }) => theme.colors.text};
    font-style: italic;
    padding: 16px;
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 10px;
    text-align: center;
  }
`;

export const BookingMessage = styled.div<{ type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 10px;
  background: ${({ type, theme }) =>
    type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border: 1px solid ${({ type, theme }) =>
    type === 'success' ? '#2ecc71' : '#e74c3c'};
  color: ${({ type, theme }) =>
    type === 'success' ? '#2ecc71' : '#e74c3c'};

  svg {
    margin-right: 12px;
    flex-shrink: 0;
  }
`;

export const SlotList = styled.div`
  margin-bottom: 24px;

  > strong {
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    display: block;
    margin-bottom: 16px;
  }
`;

export const SlotItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: ${({ theme }) => theme.colors.secondary};
  border-radius: 10px;
  margin-bottom: 12px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(5px);
  }

  .time {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.title};
    font-size: 18px;
    font-weight: 500;

    svg {
      color: ${({ theme }) => theme.colors.primary};
      margin-right: 12px;
    }
  }
`;

export const BookButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  border: 0;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  display: flex;
  align-items: center;

  &:hover:not(:disabled) {
    background: ${({ theme }) => shade(0.2, theme.colors.primary)};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    margin-right: 8px;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Calendar = styled.aside`
  width: 380px;

  .DayPicker {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 10px;

    ${({ theme }) =>
      theme.title === 'light' &&
      css`
        box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.1);
      `};
  }

  .DayPicker-wrapper {
    padding-bottom: 0;
  }

  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }

  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 8px;
    margin: 16px;
  }

  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }

  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: ${({ theme }) => theme.colors.secondary};
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.title};
  }

  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${({ theme }) => shade(0.2, theme.colors.disabled)};
    ${({ theme }) =>
      theme.title === 'light' &&
      css`
        border: 1px solid #222;
      `};
  }

  .DayPicker-Day--today {
    font-weight: normal;
  }

  .DayPicker-Day--disabled {
    color: ${({ theme }) => theme.colors.disabled} !important;
    background: transparent !important;
  }

  .DayPicker-Day--selected {
    background: ${({ theme }) => theme.colors.primary} !important;
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.secondary} !important;
  }
`;
