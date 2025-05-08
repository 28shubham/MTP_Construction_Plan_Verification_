import api, { uploadFile } from './api';
import { VERIFICATION_ENDPOINTS } from '../apiConfig';
import { handleError } from '../utils';
import { getFileBlob } from './file';

/**
 * Verify a form submission
 * @param {Object} formData - The form data to verify
 * @returns {Promise} - API response with verification result
 */
export const verifyForm = async (formData) => {
  try {
    const response = await api.post(VERIFICATION_ENDPOINTS.VERIFY_FORM, formData);
    return response.data;
  } catch (error) {
    handleError('Verification failed. Please try again.');
    return { success: false, error: 'Verification failed' };
  }
};

/**
 * Verify a PDF file
 * @param {File|string} fileOrFilename - Either a File object or a filename string
 * @returns {Promise} - API response with verification result
 */
export const verifyPdf = async (fileOrFilename) => {
  try {
    let file;
    
    // If a filename is provided, fetch the file first
    if (typeof fileOrFilename === 'string') {
      const blob = await getFileBlob(fileOrFilename);
      if (!blob) {
        return { success: false, error: 'Could not retrieve the file' };
      }
      
      file = new File([blob], 'construction-plan.pdf', {
        type: 'application/pdf',
      });
    } else {
      file = fileOrFilename;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await uploadFile(VERIFICATION_ENDPOINTS.VERIFY_PDF, formData);
    return { success: true, data: response };
  } catch (error) {
    handleError('PDF verification failed. Please try again.');
    return { success: false, error: 'Verification failed' };
  }
};

export default {
  verifyForm,
  verifyPdf,
}; 