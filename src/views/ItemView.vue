<template>
  <div class="item-view" v-if="item">
    <template v-if="item">
      <div class="item-view-header">
        <a :href="item.url" target="_blank">
          <h1>{{ item.title }}</h1>
        </a>
        <span v-if="item.url" class="host"> ({{ util.host(item.url) }}) </span>
        <p class="meta">
          {{ item.score }} points | by
          <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
          {{ util.timeAgo(item.time) }} ago
        </p>
      </div>
      <div class="item-view-comments">
        <p class="item-view-comments-header">
          {{ item.kids ? item.descendants + " comments" : "No comments yet." }}
          <spinner :show="loading"></spinner>
        </p>
        <ul v-if="!loading" class="comment-children">
          <comment
            v-for="comment in item.comments"
            :key="comment.id"
            :id="comment.id"
            :comment="comment"
          ></comment>
        </ul>
      </div>
    </template>
  </div>
</template>
<script>
import * as util from "../util"
import api from "../api"
import Spinner from "../components/Spinner.vue"
import Comment from "../components/Comment.vue"

export default {
  name: "item-view",
  components: { Spinner, Comment },
  data() {
    return {
      loading: true,
      item: {}
    }
  },
  setup() {
    return { util }
  },
  beforeMount() {
    // fetch a story and all it's comments, include children comments
    async function recurFetchComments(commentId) {
      let resp = await api(`item/${commentId}`)
      let comment = await resp.json()
      let comments = await Promise.all(
        (comment.kids || []).map(id => recurFetchComments(id))
      )
      comment.comments = comments
      return comment
    }
    recurFetchComments(this.$route.params.id).then(data => {
      this.item = data
      this.loading = false
    })
  }
}
</script>

<style lang="stylus">
.item-view-header {
  background-color: #fff;
  padding: 1.8em 2em 1em;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  h1 {
    display: inline;
    font-size: 1.5em;
    margin: 0;
    margin-right: 0.5em;
  }

  .host, .meta, .meta a {
    color: #828282;
  }

  .meta a {
    text-decoration: underline;
  }
}

.item-view-comments {
  background-color: #fff;
  margin-top: 10px;
  padding: 0 2em 0.5em;
}

.item-view-comments-header {
  margin: 0;
  font-size: 1.1em;
  padding: 1em 0;
  position: relative;

  .spinner {
    display: inline-block;
    margin: -15px 0;
  }
}

.comment-children {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

@media (max-width: 600px) {
  .item-view-header {
    h1 {
      font-size: 1.25em;
    }
  }
}
</style>
