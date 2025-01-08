export enum PublicMessage {
  OTPSent = 'otp code has sent.',
}

export enum BadRequesMessage {
  UsernameNotAllowedForRegister = 'username method not allowed for register',
}

export enum AuthMessage {
  UserNotFound = 'user not found',
  AlreadyExists = 'user already exists',
}

export enum NotFoundMessage {}

export enum ValidlationMessage {
  InvalidMethod = 'invalid method',
  InvaliddEmail = 'invalid email',
  InvalidPhone = 'invalid phone number',
}
