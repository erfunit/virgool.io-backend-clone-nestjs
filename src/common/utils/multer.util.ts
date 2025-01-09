import { Request } from 'express';
import { mkdirSync } from 'fs';
import { extname, join } from 'path';
import { ValidlationMessage } from '../enums/message.enums';
import { BadRequestException } from '@nestjs/common';

type CallbackDestination = (error: Error | null, destination: string) => void;
type CallbackFileName = (error: Error | null, destination: string) => void;
type MulterFile = Express.Multer.File;

export function multerDestination(fieldName: string) {
  return function (
    req: Request,
    file: MulterFile,
    callback: CallbackDestination,
  ): void {
    const path = join('public', 'uploads', fieldName);
    mkdirSync(path, { recursive: true });
    callback(null, path);
  };
}

export function multerFileName(
  req: Request,
  file: MulterFile,
  callback: CallbackFileName,
): void {
  const ext = extname(file.originalname).toLocaleLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
    callback(
      new BadRequestException(ValidlationMessage.InvalidImageFormat),
      null,
    );
  } else {
    const filename = `${Date.now()}${ext}`;
    callback(null, filename);
  }
}
