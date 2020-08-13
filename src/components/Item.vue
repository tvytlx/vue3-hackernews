<template>
  <div>
    <a :href="doc.url">{{ doc.title }}</a>
  </div>
</template>
<script>
import api from "../api"

export default {
  name: "item",
  data() {
    return {
      doc: {}
    }
  },
  props: {
    id: Number
  },
  mounted() {
    api(`item/${this.id}`)
      .then(resp => resp.json())
      .then(data => (this.doc = data))
  }
}
</script>
