export const apiPaths = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  getMe: '/auth/me',
  updateProfile: '/auth/profile',
  changePassword: '/auth/change-password',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',

  // Upload
  upload: '/upload',

  // Users
  getUsers: '/users',
  getUser: (id) => `/users/${id}`,

  // Destinations
  getDestinations: '/destinations',
  getDestination: (id) => `/destinations/${id}`,
  createDestination: '/destinations',
  updateDestination: (id) => `/destinations/${id}`,
  deleteDestination: (id) => `/destinations/${id}`,

  // Guides
  getGuides: '/guides',
  getGuide: (id) => `/guides/${id}`,
  updateGuideAvailability: (id) => `/guides/${id}/availability`,

  // Requests
  getRequests: '/requests',
  createRequest: '/requests',
  updateRequest: (id) => `/requests/${id}`,

  // Notifications
  getNotifications: '/notifications',
  markAsRead: (id) => `/notifications/${id}/read`,

  // Admin
  adminGetGuides: '/admin/guides',
  adminVerifyGuide: (id) => `/admin/guides/${id}/verify`,
};