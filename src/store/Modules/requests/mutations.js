export default {
  addRequest(state, payload) {
    state.requests.push(payload);
  },
  loadRequest(state, payload) {
    // Instant Request Array with payload
    state.requests = payload;
  },
};
