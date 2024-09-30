import type { ClickUpEntry, ClickUpSpace } from '../io'

import { unfurlSearchParams } from '../utils/unfurl-search-params'
import { createClickUpPayload } from './create-clickup-payload'

export async function getClickUpData() {
  const userId = process.env.CLICKUP_USER_ID
  const teamId = process.env.CLICKUP_TEAM_ID

  if (!userId) {
    throw new Error('CLICKUP_USER_ID is not set')
  }

  const params = {
  /**
   * Note: Strangely 'assignees' needs to be an array with more than one element
   * More info: https://clickup.com/api/clickupreference/operation/GetFilteredTeamTasks/#!in=query&path=assignees&t=request
   */
    assignees: [userId, userId],
    subtasks: 'true'
  }

  const clickUpSpaces = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/space?archived=false`, {
    method: 'GET',
    headers: {
      'Authorization': `${process.env.CLICKUP_API_TOKEN}`
    }
  }).then(async (response) => {

    if (!response.ok) {
      const errorData = await response.text()
      const parsedErrorData = JSON.parse(errorData)
      console.error(`Failed to fetch data: ${response.statusText} - ${parsedErrorData.err}`)

      return {
        error: true,
        status: 400,
        statusText: `${response.statusText}: Failed to fetch ClickUp data. ${parsedErrorData}`,
      }
    }

    const data = await response.text()
    const parsedData = JSON.parse(data)

    return parsedData
  })

  const clickUpData = await fetch(`https://api.clickup.com/api/v2/team/${teamId}/task?${unfurlSearchParams(params)}`, {
    method: 'GET',
    headers: {
      'Authorization': `${process.env.CLICKUP_API_TOKEN}`
    },
  }).then(async (response) => {

    if (!response.ok) {
      const errorData = await response.text()
      const parsedErrorData = JSON.parse(errorData)
      console.error(`Failed to fetch data: ${response.statusText} - ${parsedErrorData.err}`)

      return {
        error: true,
        status: 400,
        statusText: `${response.statusText}: Failed to fetch ClickUp data`,
      }
    }

    const data = await response.text()
    const parsedData = JSON.parse(data)

    if (!parsedData.tasks.length) {
      console.error('No ClickUp tasks found')

      return {
        error: true,
        status: 204,
        statusText: 'No Content: No ClickUp tasks found',
      }
    }
  
    const tasksData = parsedData.tasks
      .map((task:ClickUpEntry) => {
        const clickUpSpaceData = clickUpSpaces.spaces.find((space:ClickUpSpace) => space.id === task.space.id)
        const { name, color } = clickUpSpaceData

        return {
          custom_id: task.custom_id,
          name: task.name,
          status: {
            status: task.status.status,
            color: task.status.color,
            orderindex: task.status.status === 'in progress' ? 1 : 2,
          },
          priority: {
            priority: task.priority?.priority ?? 'normal',
            color: task.priority?.color ?? '#879dff',
            orderindex: Number(task.priority?.orderindex ?? '3')
          },
          url: task.url,
          space: {
            id: task.space.id,
            ...(name && { name }),
            ...(color && { color }),
          },
          time_estimate: task.time_estimate,
          time_spent: task.time_spent,
        }
      })
  
    return tasksData
  }).then((tasksData) => {
    const clickUpPayload = createClickUpPayload(tasksData)
    return clickUpPayload
  })

  return clickUpData
}