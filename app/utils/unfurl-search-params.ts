export const unfurlSearchParams = (
  params: {
    [key: string]: string | string[]
  }
) => {
  const urlParams = new URLSearchParams()

  for (const key in params) {
    const keyValue = params[key]
    if (Array.isArray(keyValue)) {
      keyValue.forEach((value) => {
        urlParams.append(key, value)
      })
    } else {
      urlParams.append(key, keyValue)
    }
  }

  return urlParams.toString()
}