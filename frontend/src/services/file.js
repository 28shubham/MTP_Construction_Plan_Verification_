import api, { uploadFile } from './api';
import { FILE_ENDPOINTS } from '../apiConfig';
import { handleSuccess, handleError } from '../utils';

/**
 * Upload a file with associated metadata
 * @param {Object} data - File data
 * @param {File} data.file - The file to upload
 * @param {string} data.title - Title/type of the file
 * @returns {Promise} - API response with upload status
 */
export const uploadPdfFile = async (data) => {
  try {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('file', data.file);

    const result = await uploadFile(FILE_ENDPOINTS.UPLOAD, formData);
    
    if (result.status === 'ok') {
      handleSuccess('File uploaded successfully!');
      return {
        success: true,
        filePath: result.filePath,
        message: result.message,
      };
    } else {
      handleError(result.message || 'Failed to upload file');
      return { success: false };
    }
  } catch (error) {
    handleError('Error uploading file. Please try again.');
    return { success: false };
  }
};

/**
 * Get all uploaded files
 * @returns {Promise} - API response with file list
 */
export const getUploadedFiles = async () => {
  try {
    const result = await api.get(FILE_ENDPOINTS.GET_FILES);
    return result.data?.data || [];
  } catch (error) {
    handleError('Error fetching files. Please try again.');
    return [];
  }
};

/**
 * Get the URL for a specific file
 * @param {string} filename - The filename
 * @returns {string} - The complete file URL
 */
export const getFileUrl = (filename) => {
  if (!filename) return null;
  return FILE_ENDPOINTS.FILE_PATH(filename);
};

/**
 * Get a file as a blob object
 * @param {string} filename - The filename to fetch
 * @returns {Promise<Blob>} - The file as a blob
 */
export const getFileBlob = async (filename) => {
  try {
    const response = await api.get(FILE_ENDPOINTS.FILE_PATH(filename), {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    handleError('Error downloading file. Please try again.');
    return null;
  }
};

export default {
  uploadPdfFile,
  getUploadedFiles,
  getFileUrl,
  getFileBlob
}; 