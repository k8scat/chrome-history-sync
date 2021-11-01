const httpPut = (url, data) => {
  return fetch(url, {
    method: "PUT",
    body: JSON.stringify(data),
    cache: "no-cache",
    headers: {
      "content-type": "application/json"
    }
  }).then(res => res.json())
}

const syncVisits = () => {
  const t = new Date().getTime()
  const query = {
    endTime: t,
    startTime: t - (3600 * 24 * 1000 * 365),
    maxResults: 10000000,
    text: ""
  }
  let historyCount = 0
  let visitCount = 0
  const historyResult = document.getElementById("historyResult")
  const visitResult = document.getElementById("visitResult")
  chrome.history.search(query, (historyItems) => {
    console.log("historyItems len:", historyItems.length);
    (async () => {
      for (const historyItem of historyItems) {
        await httpPut(`http://127.0.0.1:9200/chrome/visit/${historyItem.id}`, historyItem).then(() => {
          historyCount += 1
          historyResult.textContent = `history count: ${historyCount}`
        }).catch((err) => {
          console.log("Add history failed:", err, historyItem)
        })
        if (historyItem.url) {
          await chrome.history.getVisits({ url: historyItem.url }, (visitItems) => {
            console.log("visitItems len:", visitItems.length, historyItem);
            (async () => {
              for (const visitItem of visitItems) {
                await httpPut(`http://127.0.0.1:9200/chrome/visit/${visitItem.visitId}`, visitItem).then(() => {
                  visitCount += 1
                  visitResult.textContent = `visit count: ${visitCount}`
                }).catch((err) => {
                  console.log("Add visit failed:", err, visitItem)
                })
              }
            })()
          })
          continue
        }
        console.log("historyItem.url not found:", historyItem)
      }
    })()
  })
}

const syncButton = document.getElementById("sync")
syncButton.addEventListener("click", () => {
  syncVisits()
});
