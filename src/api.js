export default function api(slot) {
  return fetch(`https://hacker-news.firebaseio.com/v0/${slot}.json`)
}
