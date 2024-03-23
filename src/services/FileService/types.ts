export const S3FolderEnum = {
  TEMPLATE: 'template',
  PROFILE_IMG: 'profile-img',
  SIGNATURE: 'signature',
}

export type UploadFileResponse = {
  fileUrl: string
  accessUrl: string
}
