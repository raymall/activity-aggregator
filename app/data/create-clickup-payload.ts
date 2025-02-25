
import type { ClickUpData, ClickUpError } from '../io'
import { convertNumberToEmoji } from '../utils/convert-number-to-emoji'
import { capitalizeString } from '../utils/capitalize-string'
import {
  slackDivider,
  slackContext,
  slackHeader,
} from '../utils/format-slack-message'

export async function createClickUpPayload(clickUpData: ClickUpData[] | ClickUpError) {
  const priorities:{ [key: string]: string } = {
    'urgent': ':bangbang:',
    'high': ':exclamation:'
  }

  const clickUpPayload = []

  if (
    'error' in clickUpData ||
    !clickUpData.length
  ) {
    clickUpPayload.push(
      slackHeader(`No assigned ClickUp tasks found for Raymall`)
    )

    return clickUpPayload
  }

  clickUpPayload.push(
    slackHeader(`His ongoing priorities are:`)
  )
  
  clickUpData
    .reduce((accumulator: ClickUpData[], task:ClickUpData) => {
      const status = task.status.status
      
      if (
        status === 'ready to start' ||
        status === 'in progress' ||
        status === 'ready to fix'
      ) {
        accumulator.push(task)
      }

      return accumulator
    }, [])
    .sort((a, b) => {
      if (a.priority.orderindex !== b.priority.orderindex) {
        return a.priority.orderindex - b.priority.orderindex
      }
      
      return a.status.orderindex - b.status.orderindex
    })
    .map((task, index, arr) => {
      const custom_id = task.custom_id
      const name = task.name
      const status = task.status.status
      const priority = task.priority.priority
      const url = task.url

      const title = `${convertNumberToEmoji((index + 1))} * <${url}|${custom_id ? '[' + custom_id + ']' : ''} ${name}>*`
      const info = `Status: *${status.toLocaleUpperCase()}* | Priority: ${priorities[priority] ? priorities[priority] : ''}*${capitalizeString(priority)}*`

      clickUpPayload.push(
        slackContext(`${title}\n${info}`)
      )

      if (index < arr.length - 1) {
        clickUpPayload.push(slackDivider())
      }
    })

  return clickUpPayload
}