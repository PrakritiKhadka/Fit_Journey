// toastUtils.js
import { toast } from 'react-toastify';

export const showSuccessToast = (message) =>
  toast.success(message, { icon: "✅" });

export const showErrorToast = (message) =>
  toast.error(message, { icon: "❌" });

export const showInfoToast = (message) =>
  toast.info(message, { icon: "ℹ️" });
