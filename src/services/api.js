/**
 * API Service - Handles all backend API calls
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// ============================================
// AUTHENTICATION API
// ============================================

export const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.token) {
      setAuthToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  forgotPassword: async (email) => {
    return await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, password, confirmPassword) => {
    return await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password, confirmPassword }),
    });
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      removeAuthToken();
      localStorage.removeItem('user');
    }
  },

  refreshToken: async (refreshToken) => {
    const response = await apiRequest('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },
};

// ============================================
// USER PROFILE API
// ============================================

export const userAPI = {
  getProfile: async () => {
    const response = await apiRequest('/users/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiRequest('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  },

  uploadAvatar: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiRequest('/users/me/avatar', {
      method: 'POST',
      body: formData,
    });
    return response.data;
  },

  getSettings: async () => {
    const response = await apiRequest('/users/me/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiRequest('/users/me/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return response.data;
  },

  getDevices: async () => {
    const response = await apiRequest('/users/me/devices');
    return response.data;
  },

  logoutDevice: async (deviceId) => {
    return await apiRequest(`/users/me/devices/${deviceId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// TASKS API
// ============================================

export const tasksAPI = {
  getTasks: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/tasks${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await apiRequest('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  updateTask: async (taskId, taskData) => {
    const response = await apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  deleteTask: async (taskId) => {
    return await apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  toggleTask: async (taskId) => {
    const response = await apiRequest(`/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    return response.data;
  },

  getMainGoal: async (date) => {
    const queryParams = date ? `?date=${date}` : '';
    const response = await apiRequest(`/tasks/main-goal${queryParams}`);
    return response.data;
  },

  updateMainGoal: async (mainGoalData) => {
    const response = await apiRequest('/tasks/main-goal', {
      method: 'PUT',
      body: JSON.stringify(mainGoalData),
    });
    return response.data;
  },
};

// ============================================
// GOALS API
// ============================================

export const goalsAPI = {
  getGoals: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/goals${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getGoal: async (goalId) => {
    const response = await apiRequest(`/goals/${goalId}`);
    return response.data;
  },

  createGoal: async (goalData) => {
    const response = await apiRequest('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
    return response.data;
  },

  updateGoal: async (goalId, goalData) => {
    const response = await apiRequest(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
    return response.data;
  },

  deleteGoal: async (goalId) => {
    return await apiRequest(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },

  // Milestones
  createMilestone: async (goalId, milestoneData) => {
    const response = await apiRequest(`/goals/${goalId}/milestones`, {
      method: 'POST',
      body: JSON.stringify(milestoneData),
    });
    return response.data;
  },

  updateMilestone: async (goalId, milestoneId, milestoneData) => {
    const response = await apiRequest(`/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'PUT',
      body: JSON.stringify(milestoneData),
    });
    return response.data;
  },

  deleteMilestone: async (goalId, milestoneId) => {
    return await apiRequest(`/goals/${goalId}/milestones/${milestoneId}`, {
      method: 'DELETE',
    });
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const response = await apiRequest(`/goals/${goalId}/milestones/${milestoneId}/toggle`, {
      method: 'PATCH',
    });
    return response.data;
  },

  // Goal Tasks
  createGoalTask: async (goalId, taskData) => {
    const response = await apiRequest(`/goals/${goalId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  updateGoalTask: async (goalId, taskId, taskData) => {
    const response = await apiRequest(`/goals/${goalId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return response.data;
  },

  deleteGoalTask: async (goalId, taskId) => {
    return await apiRequest(`/goals/${goalId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  toggleGoalTask: async (goalId, taskId) => {
    const response = await apiRequest(`/goals/${goalId}/tasks/${taskId}/toggle`, {
      method: 'PATCH',
    });
    return response.data;
  },
};

// ============================================
// EVENTS API
// ============================================

export const eventsAPI = {
  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/events${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await apiRequest(`/events/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return response.data;
  },

  updateEvent: async (eventId, eventData) => {
    const response = await apiRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return response.data;
  },

  deleteEvent: async (eventId) => {
    return await apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsAPI = {
  getNotifications: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/notifications${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
    return response.data;
  },

  markAllAsRead: async () => {
    return await apiRequest('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  deleteNotification: async (notificationId) => {
    return await apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  deleteAllNotifications: async () => {
    return await apiRequest('/notifications', {
      method: 'DELETE',
    });
  },
};

// ============================================
// CONTACT API
// ============================================

export const contactAPI = {
  submitContact: async (contactData) => {
    return await apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// ============================================
// ADMIN API
// ============================================

export const adminAPI = {
  getDashboardStats: async (period = 'month') => {
    const response = await apiRequest(`/admin/dashboard/stats?period=${period}`);
    return response.data;
  },

  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/admin/users${queryParams ? `?${queryParams}` : ''}`;
    const response = await apiRequest(endpoint);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiRequest(`/admin/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await apiRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    return await apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  exportUsers: async (format, filters = {}) => {
    const response = await apiRequest('/admin/users/export', {
      method: 'POST',
      body: JSON.stringify({ format, filters }),
    });
    return response.data;
  },
};

