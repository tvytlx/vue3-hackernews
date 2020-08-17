<template>
  <div class="news-view">
    <div class="news-list-nav">
      <router-link v-if="page > 1" :to="'/' + type + '/' + (page - 1)"
        >&lt; prev</router-link
      >
      <a v-else class="disabled">&lt; prev</a>
      <span>{{ page }}/{{ totalPage }}</span>
      <router-link v-if="page < totalPage" :to="'/' + type + '/' + (page + 1)"
        >more &gt;</router-link
      >
      <a v-else class="disabled">more &gt;</a>
    </div>
    <transition :name="transition">
      <div class="news-list">
        <transition-group tag="ul" name="item">
          <item
            v-for="id in displayedItems"
            :key="id"
            :id="id"
            @delete-item="deleteEmpty(id)"
          ></item>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import Item from "../components/Item.vue"
import api from "../api"

const perPage = 20

export default {
  name: "item-list",
  components: {
    Item
  },
  props: {
    type: String
  },
  mounted() {
    // initial, refresh every 5 s
    this.interval = setInterval(() => {
      api(`${this.type}stories`)
        .then(response => response.json())
        .then(data => (this.itemsId = data))
    }, 5000)
  },
  unmounted() {
    clearInterval(this.interval)
  },
  data() {
    return {
      transition: "slide-right",
      itemsId: [],
      deletedItemsId: new Set()
    }
  },
  methods: {
    deleteEmpty(id) {
      this.deletedItemsId.add(id)
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.itemsId.length / perPage)
    },
    displayedItems() {
      const start = perPage * (this.page - 1)
      const end = start + perPage
      const ids = this.itemsId
        .slice(start, end)
        .filter(v => !this.deletedItemsId.has(v))
      // remove deleted items
      const compensateNum = perPage - ids.length
      ids.push(...this.itemsId.slice(end, end + compensateNum))
      console.log(this.deletedItemsId, ids)
      return ids
    },
    page() {
      return Number(this.$route.params.page || 1)
    }
  }
}
</script>

<style lang="stylus">
.news-view {
  padding-top: 45px;
}

.news-list-nav, .news-list {
  background-color: #fff;
  border-radius: 2px;
}

.news-list-nav {
  padding: 15px 30px;
  position: fixed;
  text-align: center;
  top: 55px;
  left: 0;
  right: 0;
  z-index: 998;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  a {
    margin: 0 1em;
  }

  .disabled {
    color: #ccc;
  }
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
}

.slide-left-enter, .slide-right-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.slide-left-leave-to, .slide-right-enter {
  opacity: 0;
  transform: translate(-30px, 0);
}

.item-move, .item-enter-active, .item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.item-enter {
  opacity: 0;
  transform: translate(30px, 0);
}

.item-leave-active {
  position: absolute;
  opacity: 0;
  transform: translate(30px, 0);
}

@media (max-width: 600px) {
  .news-list {
    margin: 10px 0;
  }
}
</style>
