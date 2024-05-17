export const convertNumberToEmoji = (number: number) => {
  const digits = [':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:', ':nine:']
  const numberString = String(number)

  const emoji = [...numberString].map((char) => digits[parseInt(char)]).join('')
  return emoji
}