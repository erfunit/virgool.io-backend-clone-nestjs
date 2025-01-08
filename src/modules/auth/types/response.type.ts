import { PublicMessage } from 'src/common/enums/message.enums';

export type AuthResponse = {
  message: PublicMessage;
  code: string;
  token: string;
};
