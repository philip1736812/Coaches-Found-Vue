import { createStore } from 'vuex';

import coachesModule from './Modules/coaches/index.js';
import requestsModule from './Modules/requests/index.js';
import AuthModule from './Modules/auth/index.js';

const store = createStore({
  modules: {
    coaches: coachesModule,
    requests: requestsModule,
    auth: AuthModule,
  },
});

export default store;
