<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error Occurred"
      @close="confirmError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <p>Authenticating...</p>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-mail</label>
          <input type="email" id="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please enter a valid email and password (must be at least 6 character)
        </p>
        <base-button> {{ submitBtnCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">
          {{ switchModeBtnCaption }}
        </base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      formIsValid: true,
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  methods: {
    async submitForm() {
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;

      // Data sent to Auth Firebase using in Vuex auth --> actions.
      const actionPayload = {
        email: this.email,
        password: this.password,
      };

      try {
        // Login
        if (this.mode === 'login') {
          await this.$store.dispatch('login', actionPayload);
        }
        // Register
        else await this.$store.dispatch('signUp', actionPayload);
      } catch (err) {
        this.error =
          (err.message && `Something wrong! ${err.message}`) ||
          'SignUp failed! Please try again later.';
      } finally {
        const redirectUrl = `/${this.$route.query.register || ''}`;
        this.$router.replace(redirectUrl);
      }

      this.isLoading = false;
    },
    switchAuthMode() {
      if (this.mode == 'login') this.mode = 'signUp';
      else this.mode = 'login';
    },
    confirmError() {
      this.error = null;
    },
  },
  computed: {
    submitBtnCaption() {
      if (this.mode === 'login') return 'Login';
      else return 'SignUp';
    },
    switchModeBtnCaption() {
      if (this.mode === 'login') return 'SignUp Instead';
      else return 'Login Instead';
    },
  },
};
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
