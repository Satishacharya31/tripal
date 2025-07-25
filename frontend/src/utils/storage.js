import Cookies from 'js-cookie';

const storage = {
  /**
   * Retrieves an item from storage.
   * @param {string} key The key of the item to retrieve.
   * @returns {string|null} The retrieved item, or null if not found.
   */
  get(key) {
    try {
      return Cookies.get(key) || null;
    } catch (error) {
      console.error(`Error getting item "${key}" from storage:`, error);
      return null;
    }
  },

  /**
   * Stores an item in storage.
   * @param {string} key The key of the item to store.
   * @param {string} value The value of the item to store.
   */
  set(key, value) {
    try {
      Cookies.set(key, value, { expires: 7, path: '/' }); // Expires in 7 days
    } catch (error) {
      console.error(`Error setting item "${key}" in storage:`, error);
    }
  },

  /**
   * Removes an item from storage.
   * @param {string} key The key of the item to remove.
   */
  remove(key) {
    try {
      Cookies.remove(key, { path: '/' });
    } catch (error) {
      console.error(`Error removing item "${key}" from storage:`, error);
    }
  },
};

export default storage;
