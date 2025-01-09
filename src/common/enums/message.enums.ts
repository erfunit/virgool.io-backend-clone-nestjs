export enum PublicMessage {
  OTPSent = 'otp code has sent.',
  LogginSuccess = "You've logged in successfully",
  CategoryCreated = 'created successfully',
  CategoryDeleted = 'category deleted successfully',
  CategoryUpdate = 'category updated successfully',
  ProfileSet = 'profile data set successfully',
}

export enum BadRequesMessage {
  UsernameNotAllowedForRegister = 'username method not allowed for register',
}

export enum AuthMessage {
  UserNotFound = 'user not found',
  AlreadyExists = 'user already exists',
  ExpiredCode = 'expired or invalid code, try getting a new code.',
  TryAgain = 'try again',
  InvalidCredentials = 'invalid credentials',
}

export enum NotFoundMessage {
  CategoryNotFound = 'category not found',
}

export enum ValidlationMessage {
  InvalidMethod = 'invalid method',
  InvaliddEmail = 'invalid email',
  InvalidPhone = 'invalid phone number',
  InvalidImageFormat = 'invalid image format, png, jpg, jpeg are allowed',
}

export enum ConflictMessage {
  CategoryExists = 'category already exists',
}
