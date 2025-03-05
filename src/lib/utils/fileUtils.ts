
/**
 * Get the file type display name
 * @param filename - The filename to check
 * @returns The display name for the file type
 */
export const getFileTypeDisplay = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return 'PDF';
    case 'docx': return 'Word';
    case 'xlsx': 
    case 'xls': return 'Excel';
    default: return extension?.toUpperCase() || 'Document';
  }
};

/**
 * Check if a file is supported
 * @param file - The file to check
 * @returns Whether the file is supported
 */
export const isSupportedFileType = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const supportedExtensions = ['pdf', 'docx', 'xlsx', 'xls'];
  return supportedExtensions.includes(extension || '');
};

/**
 * Check if a file size is within limits
 * @param file - The file to check
 * @param maxSizeMB - Maximum file size in MB
 * @returns Whether the file size is within limits
 */
export const isFileSizeValid = (file: File, maxSizeMB: number = 20): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};
