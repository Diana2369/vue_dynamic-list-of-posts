<template>
  <div class="content" data-cy="PostDetails">
    <div class="block">
      <h2 data-cy="PostTitle">#{{ post.id }}: {{ post.title }}</h2>
      <button class="delete" aria-label="close" @click="$emit('close')" data-cy="ClosePost" style="float: right;"></button>
      <p data-cy="PostBody">{{ post.body }}</p>
    </div>

    <div class="block">
      <Loader v-if="isLoadingComments" />
      <div v-if="hasErrorComments" class="notification is-danger" data-cy="CommentsError">
        Something went wrong while loading comments
      </div>
      <div v-if="deleteError" class="notification is-danger" data-cy="DeleteCommentError">
        {{ deleteError }}
      </div>

      <p v-if="!isLoadingComments && !hasErrorComments && comments.length === 0" class="title is-4" data-cy="NoCommentsMessage">
        No comments yet
      </p>

      <div v-if="!isLoadingComments && !hasErrorComments && comments.length > 0">
        <p class="title is-4">Comments:</p>
        <article v-for="comment in comments" :key="comment.id" class="message is-small" data-cy="Comment">
          <div class="message-header">
            <a :href="'mailto:' + comment.email" data-cy="CommentAuthor">{{ comment.name }}</a>
            <button class="delete is-small" aria-label="delete" data-cy="CommentDelete" @click="deleteComment(comment.id)"></button>
          </div>
          <div class="message-body" style="white-space: pre-line;" data-cy="CommentBody">
            {{ comment.body }}
          </div>
        </article>
      </div>

      <button v-if="!isFormOpen && !isLoadingComments && !hasErrorComments" class="button is-link" data-cy="WriteCommentButton" @click="isFormOpen = true">
        Write a comment
      </button>

      <NewCommentForm v-if="isFormOpen" :postId="post.id" @onAdd="addComment" @onClose="isFormOpen = false" />
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import Loader from './Loader/Loader.vue';
import NewCommentForm from './NewCommentForm.vue';
import { fetchClient } from '../utils/fetchClient';

export default {
  name: 'PostDetails',
  components: { Loader, NewCommentForm },
  props: ['post'],
  emits: ['close'],
  setup(props) {
    const comments = ref([]);
    const isLoadingComments = ref(false);
    const hasErrorComments = ref(false);
    const isFormOpen = ref(false);
    const deleteError = ref(null);

    const loadComments = async () => {
      isLoadingComments.value = true;
      hasErrorComments.value = false;
      try {
        comments.value = await fetchClient.get(`/comments?postId=${props.post.id}`);
      } catch {
        hasErrorComments.value = true;
      } finally {
        isLoadingComments.value = false;
      }
    };

    const deleteComment = async (id) => {
      deleteError.value = null;
      const commentToDelete = comments.value.find(c => c.id === id);
      comments.value = comments.value.filter(c => c.id !== id);
      try {
        await fetchClient.delete(`/comments/${id}`);
      } catch {
        comments.value.push(commentToDelete);
        deleteError.value = 'Failed to delete the comment. Please try again.';
      }
    };

    const addComment = (comment) => { comments.value.push(comment); deleteError.value = null; };

    watch(() => props.post, loadComments, { immediate: true });

    return { comments, isLoadingComments, hasErrorComments, isFormOpen, deleteError, deleteComment, addComment };
  }
};
</script>
