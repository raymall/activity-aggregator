import dotenv from 'dotenv'

import { getHarvestData } from './data/get-harvest'
import { createHarvestPayload } from './data/create-harvest-payload'

dotenv.config()

async function sendUpdate() {
  const harvestData = await getHarvestData()
  const harvestPayload = await createHarvestPayload(harvestData)
  // console.log(JSON.stringify(harvestData, null, 2))
  // console.log(JSON.stringify(harvestPayload, null, 2))

  await fetch(`${process.env.SLACK_APP_WEBHOOK_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      blocks: harvestPayload
    }),
    headers: {
      'Content-type': 'application/json'
    }
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(`${response.statusText}: Failed to post data to Slack`)
    }
  })
}

sendUpdate()
