<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <coach-filter @change-filter="setFilter"></coach-filter>
    </section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="refreshPage">Refresh</base-button>
          <base-button link to="/auth?register=register" v-if="!isLoggedIn">Login to register as coach</base-button>
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >Register as Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasCoaches">
          <coach-item
            v-for="coach in filterCoaches"
            :key="coach.id"
            :id="coach.id"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          ></coach-item>
        </ul>
        <div v-else>no any Coaches Found.</div>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import BaseButton from '../../components/UI/BaseButton.vue';

export default {
  components: { CoachItem, CoachFilter, BaseButton },
  data() {
    return {
      isLoading: true,
      error: null,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },
  computed: {
    filterCoaches() {
      return this.$store.getters['coaches/coaches'].filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend'))
          return true;

        if (this.activeFilters.backend && coach.areas.includes('backend'))
          return true;

        if (this.activeFilters.career && coach.areas.includes('career'))
          return true;

        return false;
      });
    },

    hasCoaches() {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
    },

    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },

    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
  },
  created() {
    this.loadCoach();
  },
  methods: {
    setFilter(updateFilters) {
      this.activeFilters = updateFilters;
    },
    async loadCoach() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches');
      } catch (err) {
        this.error = err.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },

    // Refresh Page Btn
    async refreshPage() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          shouldUpdate: true,
        });
      } catch (err) {
        this.error = err.message || 'Something went wrong!';
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
