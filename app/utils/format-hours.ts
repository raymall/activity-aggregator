
export const formatHours = (time: number) => {
  const hours = Math.floor(time)
  const minutes = Math.round((time - hours) * 60)
  const hourLabel = 'h'
  const minuteLabel = 'm'

  if (hours === 0) {
    return `${minutes}${minuteLabel}`
  }
  
  if (minutes === 0) {
    return `${hours}${hourLabel}`
  }
  
  return `${hours}${hourLabel} ${minutes}${minuteLabel}`
}