import dotenv from 'dotenv'

import { getHarvestData } from './data/get-harvest'
import { createHarvestPayload } from './data/create-harvest-payload'
import { getClickUpData } from './data/get-clickup'
import { createClickUpPayload } from './data/create-clickup-payload'

dotenv.config()

async function sendUpdate() {
  const harvestData = await getHarvestData()
  const harvestPayload = await createHarvestPayload(harvestData)
  // console.log(JSON.stringify(harvestData, null, 2))
  // console.log(JSON.stringify(harvestPayload, null, 2))

  const clickUpData = await getClickUpData()
  const clickUpPayload = await createClickUpPayload(clickUpData)
  // console.log(JSON.stringify(clickUpData, null, 2))
  // console.log(JSON.stringify(clickUpPayload, null, 2))

  await fetch(`${process.env.SLACK_APP_WEBHOOK_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      blocks: [
        ...harvestPayload,
        ...clickUpPayload
      ]
    }),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(async (response) => {
    if (!response.ok) {
      console.log(`${response.statusText}: Failed to post data to Slack`)
      throw new Error(`${response.statusText}: Failed to post data to Slack`)
    }
  })
}

sendUpdate()
