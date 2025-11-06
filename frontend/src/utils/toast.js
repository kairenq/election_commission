import toast from 'react-hot-toast';

// Настройки по умолчанию
const defaultOptions = {
  duration: 3000,
  position: 'top-right',
  style: {
    background: '#363636',
    color: '#fff',
    borderRadius: '8px',
    padding: '16px',
  },
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      ...defaultOptions,
      icon: '✅',
      style: {
        ...defaultOptions.style,
        background: '#10b981',
      },
    });
  },

  error: (message) => {
    toast.error(message, {
      ...defaultOptions,
      icon: '❌',
      style: {
        ...defaultOptions.style,
        background: '#ef4444',
      },
    });
  },

  info: (message) => {
    toast(message, {
      ...defaultOptions,
      icon: 'ℹ️',
      style: {
        ...defaultOptions.style,
        background: '#3b82f6',
      },
    });
  },

  warning: (message) => {
    toast(message, {
      ...defaultOptions,
      icon: '⚠️',
      style: {
        ...defaultOptions.style,
        background: '#f59e0b',
      },
    });
  },

  loading: (message) => {
    return toast.loading(message, {
      ...defaultOptions,
      duration: Infinity,
    });
  },

  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },

  promise: (promise, messages) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading || 'Загрузка...',
        success: messages.success || 'Успешно!',
        error: messages.error || 'Ошибка!',
      },
      defaultOptions
    );
  },
};

export default showToast;
