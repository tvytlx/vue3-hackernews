<template>
  <div class="news-view">
    <transition :name="transition">
      <div class="news-list">
        <transition-group tag="ul" name="item">
          <item
            v-for="item in displayedItems"
            :key="item.id"
            :id="item.id"
          ></item>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import Item from "../components/Item.vue"
import api from "../api"
export default {
  name: "item-list",
  components: {
    Item
  },
  props: {
    type: String
  },
  mounted() {
    // initial
    api(`${this.type}stories`)
      .then(response => response.json())
      .then(data => (this.itemsId = data))
  },
  data() {
    return {
      transition: "slide-right",
      itemsId: []
    }
  },
  computed: {
    displayedItems() {
      return this.itemsId.slice(0, 10).map(v => ({ id: v }))
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
