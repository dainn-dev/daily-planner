/**
 * Form validation utilities
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email là bắt buộc';
  }
  if (!emailRegex.test(email)) {
    return 'Email không hợp lệ';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Mật khẩu là bắt buộc';
  }
  if (password.length < 8) {
    return 'Mật khẩu phải có ít nhất 8 ký tự';
  }
  return null;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return 'Vui lòng xác nhận mật khẩu';
  }
  if (password !== confirmPassword) {
    return 'Mật khẩu xác nhận không khớp';
  }
  return null;
};

export const validateName = (name) => {
  if (!name) {
    return 'Họ và tên là bắt buộc';
  }
  if (name.trim().length < 2) {
    return 'Họ và tên phải có ít nhất 2 ký tự';
  }
  return null;
};

export const validateMessage = (message) => {
  if (!message) {
    return 'Nội dung tin nhắn là bắt buộc';
  }
  if (message.trim().length < 10) {
    return 'Nội dung tin nhắn phải có ít nhất 10 ký tự';
  }
  return null;
};

