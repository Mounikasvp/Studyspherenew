import Swal from 'sweetalert2';

// Success alert
export const showSuccessAlert = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true,
  });
};

// Error alert
export const showErrorAlert = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'OK',
  });
};

// Info alert
export const showInfoAlert = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'OK',
    timer: 3000,
    timerProgressBar: true,
  });
};

// Warning alert
export const showWarningAlert = (title, text = '') => {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'OK',
  });
};

// Confirmation dialog
export const showConfirmDialog = (title, text = '', confirmButtonText = 'Yes', cancelButtonText = 'No') => {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    confirmButtonText,
    cancelButtonText,
  });
};

// Toast notification (small notification at the top)
export const showToast = (title, icon = 'success') => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};

// Loading indicator
export const showLoading = (title = 'Loading...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close the currently open alert
export const closeAlert = () => {
  Swal.close();
};
