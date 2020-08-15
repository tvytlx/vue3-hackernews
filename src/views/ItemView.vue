<template>
  <div class="item-view" v-if="item">
    <template v-if="item">
      <div class="item-view-header">
        <a :href="item.url" target="_blank">
          <h1>{{ item.title }}</h1>
        </a>
        <span v-if="item.url" class="host"> ({{ item.url }}) </span>
        <p class="meta">
          {{ item.score }} points | by
          <router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
          {{ item.time }} ago
        </p>
      </div>
      <div class="item-view-comments">
        <p class="item-view-comments-header">
          {{ item.kids ? item.descendants + " comments" : "No comments yet." }}
          <spinner :show="loading"></spinner>
        </p>
        <ul v-if="!loading" class="comment-children">
          <comment
            v-for="comment in comments"
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
import api from "../api"
import Spinner from "../components/Spinner.vue"
import Comment from "../components/Comment.vue"

export default {
  name: "item-view",
  components: { Spinner, Comment },
  data() {
    return {
      loading: true,
      item: {},
      comments: []
    }
  },
  beforeMount() {
    // fetch a story
    api(`item/${this.$route.params.id}`)
      .then(resp => resp.json())
      .then(data => {
        this.item = data
        // fetch all comments of this story, include children comments
        function recurFetchComments(commentId) {
          return api(`item/${commentId}`)
            .then(resp => resp.json())
            .then(comment => {
              if (comment.kids) {
                return Promise.all(
                  comment.kids.map(id => recurFetchComments(id))
                ).then(comments => {
                  comment.comments = comments
                  return comment
                })
              } else {
                comment.comments = []
                return comment
              }
            })
        }
        recurFetchComments(this.item.id).then(data => {
          this.comments = data.comments
          this.loading = false
        })
      })
  }
}
</script>
