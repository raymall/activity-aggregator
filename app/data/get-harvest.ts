import type { HarvestRawEntry, HarvestData, HarvestEntry } from '../io'

import { getCurrentDate } from '../utils/get-current-date'

import { createHarvestPayload } from './create-harvest-payload'

export async function getHarvestData() {
  const userId = process.env.HARVEST_USER_ID

  if (!userId) {
    throw new Error('HARVEST_USER_ID env is not set')
  }

  const currentDate = getCurrentDate()

  const params = {
    user_id: userId,
    from: currentDate,
    is_running: 'false',
  }

  const urlParams = new URLSearchParams(params).toString()

  const harvestData = await fetch(`https://api.harvestapp.com/api/v2/time_entries?${urlParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.HARVEST_API_TOKEN}`,
      'Harvest-Account-Id': `${process.env.HARVEST_ACCOUNT_ID}`,
      'User-Agent': 'Raymall Perez (raymall@vaangroup.com)',
    },
  }).then(async (response) => {

    if (!response.ok) {
      console.error(`Failed to fetch data: ${response.statusText}`)

      return {
        error: true,
        status: 400,
        statusText: `${response.statusText}: Failed to fetch Harvest data`,
      }
    }

    const data = await response.text()
    const parsedData = JSON.parse(data)

    if (!parsedData.time_entries.length) {
      console.error('No Harvest time entries found')

      return {
        error: true,
        status: 204,
        statusText: 'No Content: No Harvest time entries found',
      }
    }
  
    const entriesData = parsedData.time_entries
      .map((entry:HarvestEntry) => {
        return {
          client: entry.client.name,
          project: entry.project.name,
          title: entry.notes,
          task: entry.task.name,
          reference: entry.external_reference?.permalink || '',
          hours: entry.hours,
        }
      })
      .reduce((accumulator:HarvestData[], item:HarvestRawEntry) => {
        const clientName = item.client
  
        if (!accumulator.some((item) => item.client.includes(clientName))) {
          accumulator.push({
            client: clientName,
            entries: []
          })
        }
        
        const { client, ...remainingProps } = item
        const entry = accumulator.find((item) => item.client.includes(client))
  
        if (entry) {
          entry.entries.push(remainingProps)
        }
  
        return accumulator
      }, [])
  
    return entriesData
  }).then((entriesData) => {
    const harvestPayload = createHarvestPayload(entriesData)
    return harvestPayload
  })

  return harvestData
}