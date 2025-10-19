<template>
  <div data-cy="PostsList">
    <p class="title">Posts:</p>
    <table class="table is-fullwidth is-striped is-hoverable is-narrow">
      <thead>
        <tr class="has-background-link-light">
          <th>#</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id" data-cy="Post">
          <td data-cy="PostId">{{ post.id }}</td>
          <td data-cy="PostTitle">{{ post.title }}</td>
          <td class="has-text-right is-vcentered">
            <button
              class="button"
              :class="selectedPostId === post.id ? '' : 'is-light is-link'"
              @click="$emit('postSelect', selectedPostId === post.id ? null : post.id)"
              data-cy="PostButton"
            >
              {{ selectedPostId === post.id ? 'Close' : 'Open' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PostsList',
  props: ['posts', 'selectedPostId'],
  emits: ['postSelect'],
};
</script>
