import { request } from '../helpers/axios_helper';

export const sendTelegramNotification = (location) => {
  return request('POST', '/api/telegram/send', { location });
};