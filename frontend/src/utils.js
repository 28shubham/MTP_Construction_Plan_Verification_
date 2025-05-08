import { unstable_useViewTransitionState } from 'react-router-dom';
import {toast} from 'react-toastify';

// Check if handleSuccess and handleError exist and add them if they don't

// Add the following utility functions if they don't exist:

/**
 * Display a success notification
 * @param {string} message - Success message to display
 */
export const handleSuccess = (msg) => {
  toast.success(msg, {
        position: 'top-right'
  });
};

/**
 * Display an error notification
 * @param {string} message - Error message to display
 */
export const handleError = (msg) => {
  toast.error(msg, {
        position: 'top-right'
  });
};
