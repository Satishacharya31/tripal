export const apiPaths = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  logout: '/api/auth/logout',
  getMe: '/api/auth/me',
  updateProfile: '/api/auth/profile',
  changePassword: '/api/auth/change-password',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/reset-password',

  // Upload
  upload: '/api/upload',

  // Users
  getUsers: '/api/users',
  getUser: (id) => `/api/users/${id}`,

  // Destinations
  getDestinations: '/api/destinations',
  getDestination: (id) => `/api/destinations/${id}`,
  createDestination: '/api/destinations',
  updateDestination: (id) => `/api/destinations/${id}`,
  deleteDestination: (id) => `/api/destinations/${id}`,

  // Guides
  getGuides: '/api/guides',
  getGuide: (id) => `/api/guides/${id}`,
  updateGuideAvailability: (id) => `/api/guides/${id}/availability`,

  // Requests
  getRequests: '/api/requests',
  createRequest: '/api/requests',
  updateRequest: (id) => `/api/requests/${id}`,

  // Notifications
  getNotifications: '/api/notifications',
  markAsRead: (id) => `/api/notifications/${id}/read`,

  // Admin
  adminGetGuides: '/api/admin/guides',
  adminVerifyGuide: (id) => `/api/admin/guides/${id}/verify`,
};