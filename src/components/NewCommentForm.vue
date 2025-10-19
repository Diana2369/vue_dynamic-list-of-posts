<template>
  <form data-cy="NewCommentForm" @submit.prevent="handleSubmit" novalidate>
    <div class="field" data-cy="NameField">
      <label class="label" for="comment-author-name">Author Name</label>
      <div class="control has-icons-left has-icons-right">
        <input id="comment-author-name" type="text" placeholder="Name Surname" class="input" :class="{ 'is-danger': errors.name }" v-model="name" :disabled="isSubmitting" />
        <span class="icon is-small is-left"><i class="fas fa-user"></i></span>
        <span v-if="errors.name" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"><i class="fas fa-exclamation-triangle"></i></span>
      </div>
      <p v-if="errors.name" class="help is-danger" data-cy="ErrorMessage">{{ errors.name }}</p>
    </div>

    <div class="field" data-cy="EmailField">
      <label class="label" for="comment-author-email">Author Email</label>
      <div class="control has-icons-left has-icons-right">
        <input id="comment-author-email" type="email" placeholder="email@test.com" class="input" :class="{ 'is-danger': errors.email }" v-model="email" :disabled="isSubmitting" />
        <span class="icon is-small is-left"><i class="fas fa-envelope"></i></span>
        <span v-if="errors.email" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"><i class="fas fa-exclamation-triangle"></i></span>
      </div>
      <p v-if="errors.email" class="help is-danger" data-cy="ErrorMessage">{{ errors.email }}</p>
    </div>

    <div class="field" data-cy="BodyField">
      <label class="label" for="comment-body">Comment Text</label>
      <div class="control has-icons-right">
        <textarea id="comment-body" placeholder="Type comment here" class="textarea" :class="{ 'is-danger': errors.body }" v-model="body" :disabled="isSubmitting"></textarea>
        <span v-if="errors.body" class="icon is-small is-right has-text-danger" data-cy="ErrorIcon"><i class="fas fa-exclamation-triangle"></i></span>
      </div>
      <p v-if="errors.body" class="help is-danger" data-cy="ErrorMessage">{{ errors.body }}</p>
    </div>

    <div v-if="submitError" class="notification is-danger" data-cy="SubmitError">{{ submitError }}</div>

    <div class="field is-grouped">
      <div class="control">
        <button type="submit" class="button is-link" :class="{ 'is-loading': isSubmitting }" :disabled="isSubmitting" data-cy="SubmitButton">Add</button>
      </div>
      <div class="control">
        <button type="reset" class="button is-link is-light" @click="resetForm" :disabled="isSubmitting" data-cy="ClearButton">Clear</button>
      </div>
      <div class="control">
        <button type="button" class="button is-danger is-light" @click="$emit('onClose')" :disabled="isSubmitting" data-cy="CloseButton">Cancel</button>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { fetchClient } from '../utils/fetchClient';

export default {
  name: 'NewCommentForm',
  props: ['postId'],
  emits: ['onAdd', 'onClose'],
  setup(props, { emit }) {
    const name = ref('');
    const email = ref('');
    const body = ref('');
    const errors = ref({ name: '', email: '', body: '' });
    const isSubmitting = ref(false);
    const submitError = ref(null);

    const validate = () => {
      const newErrors = {
        name: name.value.trim() ? '' : 'Name is required',
        email: email.value.trim() ? (/\S+@\S+\.\S+/.test(email.value) ? '' : 'Email is invalid') : 'Email is required',
        body: body.value.trim() ? '' : 'Enter some text'
      };
      errors.value = newErrors;
      return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = async () => {
      submitError.value = null;
      if (!validate()) return;

      isSubmitting.value = true;
      try {
        const newComment = await fetchClient.post('/comments', { postId: props.postId, name: name.value, email: email.value, body: body.value });
        emit('onAdd', newComment);
        resetForm();
      } catch {
        submitError.value = 'Failed to add comment. Please try again.';
      } finally {
        isSubmitting.value = false;
      }
    };

    const resetForm = () => { name.value = ''; email.value = ''; body.value = ''; errors.value = { name: '', email: '', body: '' }; submitError.value = null; };

    return { name, email, body, errors, isSubmitting, submitError, handleSubmit, resetForm };
  }
};
</script>
