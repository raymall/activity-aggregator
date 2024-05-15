import { Entry, HarvestData, HarvestEntry } from "../io"

export async function getHarvestData() {
  const userId = process.env.HARVEST_USER_ID

  if (!userId) {
    throw new Error('HARVEST_USER_ID is not set')
  }

  const getCurrentDate = function() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  const currentDate = getCurrentDate()

  const params = {
    user_id: process.env.HARVEST_USER_ID || '',
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
        statusText: `${response.statusText}: Failed to fetch data`,
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
      .reduce((accumulator:HarvestData[], item:Entry) => {
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
  })

  return harvestData
}