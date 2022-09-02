// import axios from 'axios';
let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'login',
    });
  },
  async signUp(context, payload) {
    return context.dispatch('auth', {
      ...payload,
      mode: 'logout',
    });
  },

  async auth(context, payload) {
    const WEB_API = context.state.WEB_FIREBASE_API_KEY;
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${WEB_API}`;
    const mode = payload.mode;

    if (mode !== 'login')
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${WEB_API}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      if (!response.ok)
        throw new Error(
          (response.message && `Something Wrong! ${response.message}`) ||
            `Authentication failed.`
        );

      const data = await response.json();

      const expiresIn = +data.expiresIn * 1000;
      // const expiresIn = 5000;
      const expirationDate = new Date().getTime() + expiresIn;

      timer = setTimeout(() => {
        context.dispatch('autoLogout');
      }, expiresIn);

      localStorage.setItem('token', data.idToken);
      localStorage.setItem('userId', data.localId);
      localStorage.setItem('tokenExpiration', expirationDate);

      context.commit('setUser', {
        token: data.idToken,
        userId: data.localId,
      });
    } catch (err) {
      throw Error(err.message);
    }
  },

  tryLogin({ commit, dispatch }) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    const expiresIn = +tokenExpiration - new Date().getTime();

    if (expiresIn < 0) {
      dispatch('logout');
      return;
    }

    timer = setTimeout(() => {
      dispatch('autoLogout');
    }, expiresIn);

    if (token && userId)
      commit('setUser', {
        token: token,
        userId: userId,
      });
  },

  logout({ commit }) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    commit('setUser', {
      token: null,
      userId: null,
      tokenExpiration: null,
    });
  },

  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  },
};
