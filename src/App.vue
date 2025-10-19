<template>
  <section class="section">
    <div class="container">
      <div class="tile is-ancestor">
        <div class="tile is-parent">
          <div class="tile is-child box is-success">
            <div class="block">
              <UserSelector
                :users="users"
                :selectedUser="selectedUser"
                @userSelect="setSelectedUser"
              />
            </div>

            <div class="block" data-cy="MainContent">
              <p v-if="!selectedUser" data-cy="NoSelectedUser">No user selected</p>
              <Loader v-if="selectedUser && isLoadingPosts" />
              <div v-if="selectedUser && hasErrorPosts" class="notification is-danger" data-cy="PostsLoadingError">
                Something went wrong!
              </div>
              <div v-if="selectedUser && !isLoadingPosts && !hasErrorPosts && posts.length === 0" class="notification is-warning" data-cy="NoPostsYet">
                No posts yet
              </div>
              <PostsList
                v-if="selectedUser && !isLoadingPosts && !hasErrorPosts && posts.length > 0"
                :posts="posts"
                :selectedPostId="selectedPostId"
                @postSelect="setSelectedPostId"
              />
            </div>
          </div>
        </div>

        <div :class="['tile', 'is-parent', 'is-8-desktop', 'Sidebar', { 'Sidebar--open': selectedPost }]" data-cy="Sidebar">
          <div v-if="selectedPost" class="tile is-child box is-success">
            <PostDetails :post="selectedPost" @close="setSelectedPostId(null)" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { fetchClient } from './utils/fetchClient';
import UserSelector from './components/UserSelector.vue';
import PostsList from './components/PostsList.vue';
import PostDetails from './components/PostDetails.vue';
import Loader from './components/Loader/Loader.vue';

export default {
  components: { UserSelector, PostsList, PostDetails, Loader },
  setup() {
    const users = ref([]);
    const selectedUser = ref(null);
    const isLoadingUsers = ref(false);
    const hasErrorUsers = ref(false);

    const posts = ref([]);
    const isLoadingPosts = ref(false);
    const hasErrorPosts = ref(false);

    const selectedPostId = ref(null);
    const selectedPost = computed(() => posts.value.find(p => p.id === selectedPostId.value) || null);

    const setSelectedUser = (user) => { selectedUser.value = user; };
    const setSelectedPostId = (id) => { selectedPostId.value = id; };

    onMounted(async () => {
      isLoadingUsers.value = true;
      try {
        users.value = await fetchClient.get('/users');
      } catch {
        hasErrorUsers.value = true;
      } finally {
        isLoadingUsers.value = false;
      }
    });

    watch(selectedUser, async (newUser) => {
      if (!newUser) {
        posts.value = [];
        return;
      }
      isLoadingPosts.value = true;
      hasErrorPosts.value = false;
      try {
        posts.value = await fetchClient.get(`/posts?userId=${newUser.id}`);
      } catch {
        hasErrorPosts.value = true;
      } finally {
        isLoadingPosts.value = false;
      }
    });

    return {
      users,
      selectedUser,
      posts,
      isLoadingPosts,
      hasErrorPosts,
      selectedPostId,
      selectedPost,
      setSelectedUser,
      setSelectedPostId
    };
  }
};
</script>