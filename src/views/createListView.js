import ItemList from "./ItemList.vue"
import { h } from "vue"

const camelize = str => str.charAt(0).toUpperCase() + str.slice(1)

export default function createListView(type) {
  return {
    name: `${type}-stories-view`,
    title: camelize(type),
    render() {
      return h(ItemList, { type })
    }
  }
}
