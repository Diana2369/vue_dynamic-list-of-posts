<template>
  <form @submit.prevent="handleSubmit">
    <div class="field" data-cy="NameField">
      <label class="label">Name</label>
      <input
        type="text"
        v-model="name"
        :class="{ 'is-danger': errors.name }"
        @input="errors.name = ''; submitError = null"
      />
    </div>
    <div class="field" data-cy="EmailField">
      <label class="label">Email</label>
      <input
        type="email"
        v-model="email"
        :class="{ 'is-danger': errors.email }"
        @input="errors.email = ''; submitError = null"
      />
    </div>
    <div class="field" data-cy="BodyField">
      <label class="label">Comment</label>
      <textarea
        v-model="body"
        :class="{ 'is-danger': errors.body }"
        @input="errors.body = ''; submitError = null"
      />
    </div>
    <button type="submit" class="button is-primary">Submit</button>
    <p v-if="submitError" class="has-text-danger">{{ submitError }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { fetchClient } from '../utils/fetchClient';

const props = defineProps<{ postId: number }>();
const emit = defineEmits<{ (e: 'onAdd', comment: any): void }>();

const name = ref('');
const email = ref('');
const body = ref('');
const errors = ref({ name: '', email: '', body: '' });
const submitError = ref<string | null>(null);
const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    const newComment = await fetchClient.post('/comments', {
      postId: props.postId,
      name: name.value,
      email: email.value,
      body: body.value,
    });
    emit('onAdd', newComment);
    body.value = '';
    errors.value.body = '';
  } catch (err: any) {
    submitError.value = err.message || 'Error submitting comment';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
