// A simple storage utility that can be extended to use other storage mechanisms.
// For now, it uses localStorage, but it can be easily swapped out for a more
// secure or persistent storage solution in the future.

const storage = {
  /**
   * Retrieves an item from storage.
   * @param {string} key The key of the item to retrieve.
   * @returns {string|null} The retrieved item, or null if not found.
   */
  get(key) {
    try {
      return localStorage.getItem(key);
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
      localStorage.setItem(key, value);
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
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item "${key}" from storage:`, error);
    }
  },
};

export default storage;