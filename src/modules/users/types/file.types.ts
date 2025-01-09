/*

{
      fieldname: 'profile_image',
      originalname: '1low.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: 'public/uploads/user-profile',
      filename: '1736422161396.jpg',
      path: 'public/uploads/user-profile/1736422161396.jpg',
      size: 280366
}
*/

type FileType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export type ProfileFiles = {
  profile_image: FileType[];
  bg_image: FileType[];
};
