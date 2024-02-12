import browser from "webextension-polyfill"

const pattern = "*://*/*.swf"
const addCors = (
  requestDetails: browser.WebRequest.OnHeadersReceivedDetailsType
) => {
  const headers = requestDetails.responseHeaders
  if (!headers) return
  const maybeCors = headers.find((header) => {
    return header.name.toLowerCase() === "access-control-allow-origin"
  })
  if (maybeCors) {
    maybeCors.value = "*"
  } else {
    headers.push({
      name: "Access-Control-Allow-Origin",
      value: "*",
    })
  }

  return { responseHeaders: headers }
}

browser.webRequest.onHeadersReceived.addListener(addCors, { urls: [pattern] }, [
  "blocking",
  "responseHeaders",
])
