<template>
  <div>
    <section>
      <base-dialog
        title="An error Occurred!"
        :show="!!error"
        @close="handleError"
      >
        {{ error }}
      </base-dialog>

      <base-card>
        <header>
          <h2>Requests Received</h2>
        </header>
        <div v-if="isLoading">
          <base-spinner></base-spinner>
        </div>
        <ul v-else-if="hasRequest && !isLoading">
          <request-items
            v-for="req in receivedRequest"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          ></request-items>
        </ul>
        <h3 v-else>You haven't received qny request yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItems from '../../components/request/RequestItems.vue';
import BaseSpinner from '../../components/UI/BaseSpinner.vue';
import BaseDialog from '../../components/UI/BaseDialog.vue';

export default {
  components: { RequestItems, BaseSpinner, BaseDialog },
  data() {
    return {
      isLoading: true,
      error: null,
    };
  },
  created() {
    this.loadReq();
  },
  methods: {
    async loadReq() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('requests/loadRequests');
      } catch (err) {
        this.error = err.message || `something fail!`;
      }
      this.isLoading = false;
    },

    handleError() {
      this.error = null;
    },
  },
  computed: {
    receivedRequest() {
      return this.$store.getters['requests/requests'];
    },
    hasRequest() {
      return this.$store.getters['requests/hasRequest'];
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
