/**
 * AsyncUtils
 * Helpers to simulate real-world backend latency and chaos.
 */
export const AsyncUtils = {
  /**
   * Simulates network latency.
   * @param {number} ms - Milliseconds to wait (default 300-800ms)
   */
  sleep: (ms) => {
    const delay = ms || Math.floor(Math.random() * 500) + 300;
    return new Promise((resolve) => setTimeout(resolve, delay));
  },

  /**
   * Simulates random network failures (1% chance).
   */
  checkConnection: () => {
    if (Math.random() < 0.01) {
      throw new Error("NetworkError: Connection timed out.");
    }
  },
};
