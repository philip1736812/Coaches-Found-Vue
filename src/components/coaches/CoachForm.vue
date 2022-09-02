<template>
  <form @submit.prevent="submitForm">
    <div class="from-control">
      <label for="firstName"> First Name </label>
      <input
        type="text"
        id="firstName"
        v-model.trim="firstName.val"
        :class="{ inputError: !firstName.isValid }"
        @blur="clearValidity('firstName')"
      />
      <p class="error" v-if="!firstName.isValid">
        *First name must not be empty.
      </p>
    </div>

    <div class="from-control">
      <label for="lastName"> Last Name </label>
      <input
        type="text"
        id="lastName"
        v-model.trim="lastName.val"
        :class="{ inputError: !lastName.isValid }"
        @blur="clearValidity('lastName')"
      />
      <p class="error" v-if="!lastName.isValid">
        *Last name must not be empty.
      </p>
    </div>

    <div class="from-control">
      <label for="description"> Description </label>
      <textarea
        id="description"
        rows="5"
        v-model.trim="description.val"
        :class="{ inputError: !description.isValid }"
        @blur="clearValidity('description')"
      ></textarea>
      <p class="error" v-if="!description.isValid">
        *Description must not be empty.
      </p>
    </div>
    
    <div class="from-control">
      <label for="hourlyRate"> Hourly Rate </label>
      <input
        type="number"
        id="hourlyRate"
        v-model.number="rate.val"
        :class="{ inputError: !rate.isValid }"
        @blur="clearValidity('rate')"
      />
      <p class="error" v-if="!rate.isValid">
        *Hourly Rate must not be empty and greater than 0
      </p>
    </div>

    <div class="from-control">
      <h3>Areas of Expertise</h3>
      <div>
        <input
          type="checkbox"
          id="frontend"
          value="frontend"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="frontend"> Frontend Development </label>
      </div>
      <div>
        <input
          type="checkbox"
          id="backend"
          value="backend"
          v-model="areas.val"
          @blur="clearValidity('areas')"
        />
        <label for="backend"> Backend Development </label>
      </div>
      <div>
        <input type="checkbox" id="career" value="career" v-model="areas.val" />
        <label for="career" @blur="clearValidity('areas')">
          Career Advisory
        </label>
      </div>
      <p class="error" v-if="!areas.isValid">
        *at least one experiment must be selected.
      </p>
    </div>

    <p class="error" v-if="!formIsValid">
      Please fix above errors and submit again
    </p>
    <base-button> Register </base-button>
  </form>
</template>

<script>
export default {
  emits: ['save-data'],
  data() {
    return {
      firstName: {
        val: '',
        isValid: true,
      },
      lastName: {
        val: '',
        isValid: true,
      },
      description: {
        val: '',
        isValid: true,
      },
      rate: {
        val: null,
        isValid: true,
      },
      areas: {
        val: [],
        isValid: true,
      },
      formIsValid: true,
    };
  },

  methods: {
    clearValidity(input) {
      if (
        (this[input].val && this[input].val === '') ||
        this[input].val.length <= 0 ||
        this[input].val < 0
      )
        return (this[input].isValid = false);

      this[input].isValid = true;
    },
    checkIsValid(name) {
      if (name.val === '') {
        name.isValid = false;
        this.formIsValid = false;
      }
    },

    validateForm() {
      this.formIsValid = true;

      this.checkIsValid(this.firstName);
      this.checkIsValid(this.lastName);
      this.checkIsValid(this.description);

      if (!this.rate.val || this.rate.val < 0) {
        this.rate.isValid = false;
        this.formIsValid = false;
      }

      if (this.areas.val.length <= 0) {
        this.areas.isValid = false;
        this.formIsValid = false;
      }
    },
    submitForm() {
      this.validateForm();

      if (!this.formIsValid) return;

      const formData = {
        first: this.firstName.val,
        last: this.lastName.val,
        desc: this.description.val,
        rate: this.rate.val,
        areas: this.areas.val,
      };

      this.$emit('save-data', formData);
    },
  },
};
</script>

<style scoped>
.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

input[type='checkbox'] + label {
  font-weight: normal;
  display: inline;
  margin: 0 0 0 0.5rem;
}

input,
textarea {
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  font: inherit;
}

input:focus,
textarea:focus {
  background-color: #f0e6fd;
  outline: none;
  border-color: #3d008d;
}

input[type='checkbox'] {
  display: inline;
  width: auto;
  border: none;
}

input[type='checkbox']:focus {
  outline: #3d008d solid 1px;
}

h3 {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.invalid label {
  color: red;
}

.invalid input,
.invalid textarea {
  border: 1px solid red;
}
.inputError {
  border: 2px solid red;
}

.error {
  color: red;
  font-size: 10px;
}
</style>
