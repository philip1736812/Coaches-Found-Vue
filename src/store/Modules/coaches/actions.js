import axios from 'axios';

export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const reStructureData = {
      firstName: data.first,
      lastName: data.last,
      areas: data.areas,
      description: data.desc,
      hourlyRate: data.rate,
    };

    const token = context.rootGetters.token;

    const dataFetch = axios.put(
      `https://vue-https-demo-173-default-rtdb.asia-southeast1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`,
      {
        coachData: reStructureData,
      }
    );
    const response = await dataFetch;
    if (response.statusText !== 'OK') return console.error(`Fetch Wrong!`);

    context.commit('registerCoach', {
      ...reStructureData,
      id: userId,
    });
  },

  async loadCoaches(context, payload = { shouldUpdate: false }) {
    const OverrideUpdate = payload.shouldUpdate;
    if (!OverrideUpdate && !context.getters.shouldUpdate) return;

    const coachesFetch = axios.get(
      `https://vue-https-demo-173-default-rtdb.asia-southeast1.firebasedatabase.app/coaches.json`
    );

    const response = await coachesFetch;
    if (
      (response.statusText && response.statusText !== 'OK') ||
      response.data === null ||
      response.request.status == '404'
    ) {
      console.log(`Running`);
      throw new Error(response.message || 'Fetch Wrong! or no data');
    }

    const coach = [];
    Object.keys(response.data).forEach((key) => {
      const coachData = {
        id: key,
        firstName: response.data[key].coachData.firstName,
        lastName: response.data[key].coachData.lastName,
        areas: response.data[key].coachData.areas,
        description: response.data[key].coachData.description,
        hourlyRate: response.data[key].coachData.hourlyRate,
      };

      coach.push(coachData);
    });

    context.commit('setCoaches', coach);
    context.commit('setFetchTimeStamp');
  },
};
