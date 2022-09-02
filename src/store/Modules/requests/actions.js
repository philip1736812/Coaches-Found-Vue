import axios from 'axios';

export default {
  async contactCoach(context, payload) {
    const newReq = {
      id: new Date().toISOString(),
      coachId: payload.value.coachId,
      userEmail: payload.value.email,
      message: payload.value.message,
    };

    const requestResponse = axios.post(
      `https://vue-https-demo-173-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${payload.value.coachId}.json`,
      {
        request: newReq,
      }
    );

    const res = await requestResponse;
    if (res.statusText !== 'OK') throw new Error(`Fetch Wrong!`);

    context.commit('addRequest', newReq);
  },

  // Load All Requests
  async loadRequests({ commit, rootState, rootGetters }) {
    const token = rootGetters.token;

    const userId = rootState.auth.userId;

    const loadData = axios.get(
      `https://vue-https-demo-173-default-rtdb.asia-southeast1.firebasedatabase.app/requests/${userId}.json?auth=${token}`
    );

    const res = await loadData;

    if (res.statusText !== 'OK') throw new Error(`Fail to load data request!`);
    if (res.data === null) return;

    const resData = [];

    Object.keys(res.data).forEach((keys) => {
      const data = res.data[keys].request;

      resData.push(data);
    });
    commit('loadRequest', resData);
  },
};
