export enum PublicMessage {
  // auth
  OTPSent = 'otp code has sent.',
  LogginSuccess = "You've logged in successfully",

  // category
  CategoryCreated = 'created successfully',
  CategoryDeleted = 'category deleted successfully',
  CategoryUpdate = 'category updated successfully',

  // Profile and user
  ProfileSet = 'profile data set successfully',
  EmailUpdated = 'email updated successfully',
  PhoneUpdated = 'phone number updated successfully',
  UsernameUpdated = 'username updated successfully',

  // blog
  BlogCreated = 'blog created successfully',
  BlogRemoved = 'blog removed successfully',
  BlogUpdated = 'blog updated successfully',

  // like
  BlogLiked = 'blog liked',
  BlogDisliked = 'blog disliked',

  // bookmark
  BlogBookmarked = 'blog bookmarked',
  BlogBookmarkedRemoved = 'bookmark removed',

  // comments
  CommentCreated = 'new comment created successfully',
  CommentAccepted = 'comment accepted',
  CommentRejected = 'comment rejected',

  // public
  SomethingWentWrong = 'something went wrong',
}

export enum BadRequestMessage {
  UsernameNotAllowedForRegister = 'username method not allowed for register',
  PreviousEmailCannotReplace = 'your exact previous email cannot replace',
  PreviousPhoneCannotReplace = 'your exact previous phone number cannot replace',
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
  BlogNotFound = 'blog not found',
  CommentNotFound = 'comment not found',
}

export enum ValidlationMessage {
  InvalidMethod = 'invalid method',
  InvaliddEmail = 'invalid email',
  InvalidPhone = 'invalid phone number',
  InvalidImageFormat = 'invalid image format, png, jpg, jpeg are allowed',
}

export enum ConflictMessage {
  CategoryExists = 'category already exists',
  Email = 'this email is used by another user',
  Phone = 'this phone number is used by another user',
  Username = 'this username is used by another user',
  BlogSlug = 'this slug is already used in another blog',
}
