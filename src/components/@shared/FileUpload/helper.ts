export const FILE_UPLOAD_CONFIG = {
  MAX_LICENSE_FILE_SIZE_KB: process.env.NEXT_PUBLIC_MAX_LICENSE_FILE_SIZE_KB
    ? parseInt(process.env.NEXT_PUBLIC_MAX_LICENSE_FILE_SIZE_KB, 10)
    : 700,

  ALLOWED_FILE_TYPES: [
    '.pdf',
    '.txt',
    '.doc',
    '.docx',
    '.md',
    '.rtf',
    '.odt',
    '.xls',
    '.xlsx',
    '.csv',
    '.json',
    '.xml',
    '.zip',
    '.tar',
    '.gz',
    '.mp3',
    '.wav',
    '.ogg',
    '.flac',
    '.mp4',
    '.avi',
    '.mov',
    '.wmv',
    '.mkv',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.bmp',
    '.svg',
    '.webp',
    '.tiff',
    '.ico'
  ],
  UPLOAD_TIMEOUT_MS: 60000,
  MAX_FILE_NAME_LENGTH: 255
} as const

export const getMaxFileSizeBytes = (): number => {
  return FILE_UPLOAD_CONFIG.MAX_LICENSE_FILE_SIZE_KB * 1024
}

export const getFormattedMaxFileSize = (): string => {
  const sizeKB = FILE_UPLOAD_CONFIG.MAX_LICENSE_FILE_SIZE_KB
  if (sizeKB >= 1024) {
    return `${(sizeKB / 1024).toFixed(1)} MB`
  }
  return `${sizeKB} KB`
}

export const getFileSizeErrorMessage = (): string => {
  const maxSize = getFormattedMaxFileSize()
  return `File size exceeds ${maxSize} limit. Please upload a smaller file.`
}
