import getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';

export default {
  state() {
    return {
      token: null,
      userId: null,
      WEB_FIREBASE_API_KEY: 'AIzaSyDs1kMpxTpBgm5cOjv4nJiKBWjMOMlmRhY',
      didAutoLogout: false,
    };
  },
  getters,
  mutations,
  actions,
};
