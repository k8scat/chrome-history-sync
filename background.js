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
  httpPut(`http://127.0.0.1:9200/chrome/history/${historyItem.id}`, historyItem).then(() => {
    if (historyItem.url) {
      chrome.history.getVisits({ url: historyItem.url }, (visitItems) => {
        (async () => {
          for (const visitItem of visitItems) {
            await httpPut(`http://127.0.0.1:9200/chrome/visit/${visitItem.visitId}`, visitItem).catch((err) => {
              console.log("Add visit failed:", err, visitItem)
            })
          }
        })()
      })
      return
    }
    console.log("historyItem.url not found:", historyItem)
  }).catch((err) => {
    console.log('Add history failed:', err, historyItem)
  })
})
