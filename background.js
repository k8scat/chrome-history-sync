// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch
const httpPut = (url, data) => {
  return fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    cache: 'no-cache',
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.json())
}

chrome.history.onVisited.addListener((historyItem) => {
  httpPut(`http://127.0.0.1:9200/chrome/history/${historyItem.id}`, historyItem).then((data) => {
    console.log('Add history:', data)
  }).catch((err) => {
    console.log('Add history failed:', err)
  })
})
