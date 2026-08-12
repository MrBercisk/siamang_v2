import Swal, { SweetAlertIcon } from 'sweetalert2';

// Custom Styled SweetAlert2 Instance matching SI AMANG theme (#1f877c)
const CustomSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl p-6 shadow-2xl border border-slate-100 font-sans',
    title: 'text-slate-900 font-bold text-lg sm:text-xl',
    htmlContainer: 'text-slate-600 text-xs sm:text-sm font-medium mt-2',
    confirmButton:
      'px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1f877c] hover:bg-[#196e65] transition-all mx-1 cursor-pointer shadow-xs',
    cancelButton:
      'px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all mx-1 cursor-pointer',
    denyButton:
      'px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-all mx-1 cursor-pointer shadow-xs',
    actions: 'mt-5 flex items-center justify-center gap-2',
  },
  buttonsStyling: false,
});

/**
 * Show a success alert
 */
export const showSuccessAlert = (title: string, text?: string) => {
  return CustomSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Selesai',
    iconColor: '#1f877c',
  });
};

/**
 * Show an error alert
 */
export const showErrorAlert = (title: string, text?: string) => {
  return CustomSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Tutup',
    iconColor: '#e11d48',
  });
};

/**
 * Show a warning alert
 */
export const showWarningAlert = (title: string, text?: string) => {
  return CustomSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'Mengerti',
    iconColor: '#f59e0b',
  });
};

/**
 * Show an info alert
 */
export const showInfoAlert = (title: string, text?: string) => {
  return CustomSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'OK',
    iconColor: '#0284c7',
  });
};

/**
 * Show a confirmation dialog (e.g., Submit, Simpan, Konfirmasi)
 */
export const showConfirmAlert = async (options: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
}): Promise<boolean> => {
  const result = await CustomSwal.fire({
    icon: options.icon || 'question',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Ya, Lanjutkan',
    cancelButtonText: options.cancelButtonText || 'Batal',
    iconColor: '#1f877c',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

/**
 * Show a delete confirmation dialog
 */
export const showDeleteConfirmAlert = async (options: {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}): Promise<boolean> => {
  const result = await CustomSwal.fire({
    icon: 'warning',
    title: options.title || 'Konfirmasi Hapus Data',
    text: options.text || 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Ya, Hapus',
    cancelButtonText: options.cancelButtonText || 'Batal',
    iconColor: '#e11d48',
    customClass: {
      popup: 'rounded-2xl p-6 shadow-2xl border border-slate-100 font-sans',
      title: 'text-slate-900 font-bold text-lg sm:text-xl',
      htmlContainer: 'text-slate-600 text-xs sm:text-sm font-medium mt-2',
      confirmButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-rose-600 hover:bg-rose-700 transition-all mx-1 cursor-pointer shadow-xs',
      cancelButton:
        'px-5 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all mx-1 cursor-pointer',
      actions: 'mt-5 flex items-center justify-center gap-2',
    },
    reverseButtons: true,
  });

  return result.isConfirmed;
};

/**
 * Show an edit/update confirmation dialog
 */
export const showEditConfirmAlert = async (options: {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}): Promise<boolean> => {
  const result = await CustomSwal.fire({
    icon: 'info',
    title: options.title || 'Simpan Perubahan?',
    text: options.text || 'Apakah Anda yakin ingin menyimpan perubahan data ini?',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Ya, Simpan',
    cancelButtonText: options.cancelButtonText || 'Batal',
    iconColor: '#1f877c',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

/**
 * Toast Notification (Top-Right non-blocking alert)
 */
export const showToast = (icon: SweetAlertIcon, title: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
      popup: 'rounded-xl p-3 shadow-lg border border-slate-100 text-xs font-bold font-sans bg-white',
    },
  });

  Toast.fire({
    icon,
    title,
  });
};

export default CustomSwal;
