export default {
  coaches(state) {
    return state.coaches;
  },
  hasCoaches(state) {
    return state.coaches && state.coaches.length > 0;
  },
  isCoach(_, getters, _2, rootGetters) {
    const coaches = getters.coaches;
    const userId = rootGetters.userId;
    return coaches.some((coach) => {
      return coach.id === userId;
    });
  },
  shouldUpdate(state) {
    const lastFetch = state.lastFetch;
    const FETCH_TIME_COUNT_SEC = 1;

    if (!lastFetch) return true;
    const currentTimeStamp = new Date().getTime();

    return (currentTimeStamp - lastFetch) / 1000 > FETCH_TIME_COUNT_SEC * 60;
  },
};
