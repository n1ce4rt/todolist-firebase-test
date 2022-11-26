import dayjs from 'dayjs';

export const utils = {
  getDate: () => {
    const date = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    return date;
  },
};