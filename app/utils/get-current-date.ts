export const getUTCToEST = () => {
  const UTCDate = new Date()
  const year = UTCDate.toLocaleString("en-US", { timeZone: "America/New_York", year: "numeric" })
  const month = UTCDate.toLocaleString("en-US", { timeZone: "America/New_York", month: "2-digit" })
  const day = UTCDate.toLocaleString("en-US", { timeZone: "America/New_York", day: "2-digit" })

  return `${year}-${month}-${day}`
}


export const getCurrentDate = () => {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate() - 1).padStart(2, '0')

  return `${year}-${month}-${day}`
}