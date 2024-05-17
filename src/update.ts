import dotenv from 'dotenv'

import { getHarvestData } from './data/get-harvest'
import { getClickUpData } from './data/get-clickup'

dotenv.config()

async function sendUpdate() {
  const harvestPayload = await getHarvestData()
  const clickUpPayload = await getClickUpData()

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
