import dotenv from 'dotenv'

import { HarvestData, HarvestDataEntry, HarvestError } from './io'
import { getHarvestData } from './data/harvest'

dotenv.config()

const convertTime = (time: number) => {
  const hours = Math.floor(time)
  const minutes = Math.round((time - hours) * 60)
  const hourLabel = hours === 1 ? "hour" : "hours"
  const minuteLabel = minutes === 1 ? "minute" : "minutes"

  if (hours === 0) {
    return `${minutes} ${minuteLabel}`
  }
  
  if (minutes === 0) {
    return `${hours} ${hourLabel}`
  }
  
  return `${hours} ${hourLabel} and ${minutes} ${minuteLabel}`
}

const formatMessage = (harvestData: HarvestData[] | HarvestError) => {
  const payload = []

  if ('error' in harvestData) {
    payload.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Hi team! \n*_No Harvest time entries found for <@UKDM34WQ1>_* today`
      }
    })

    return payload
  }

  payload.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Hi team! \n_Today <@UKDM34WQ1> worked on:_"
    }
	})
  
  harvestData
    .map((client, index) => {

      payload.push({
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*${client.client}*`
        }
      })
      
      if (client.entries.length) {
        const clientEntries = client.entries
          .map((entry:HarvestDataEntry) => {
            const entry_hours = {
              "type": "text",
              "text": `(${convertTime(entry.hours)})`,
              "style": {
                "bold": true,
                "italic": true
              }
            }

            const entryItem = entry.reference ?
              {
                "type": "rich_text_section",
                "elements": [
                  {
                    "type": "link",
                    "url": entry.reference,
                    "text": `${entry.title}`,
                    "style": {
                      "bold": true
                    }
                  },
                  {
                    "type": "text",
                    "text": ` - ${entry.task} `
                  },
                  entry_hours
                ]
              } : {
                  "type": "rich_text_section",
                  "elements": [
                    {
                      "type": "text",
                      "text": `${entry.title} - ${entry.task} `
                    },
                    entry_hours
                  ]
                }
  
            return entryItem
          })

        const clientProjects = client.entries
          .reduce((accumulator: string[], item:HarvestDataEntry) => {
            if (!accumulator.includes(item.project)) {
              accumulator.push(item.project)
            }

            return accumulator
          }, []).join(', ')

        payload.push({
          "type": "rich_text",
          "elements": [
            {
              "type": "rich_text_list",
              "style": "bullet",
              "elements": clientEntries
            }
          ]
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": `*${clientProjects}*`
            }
          ]
        })
      }

      if (index < harvestData.length - 1) {
        payload.push({
          "type": "divider"
        })
      }
    })

  return payload
}

async function sendUpdate() {
  const harvestData = await getHarvestData()
  const harvestPayload = formatMessage(harvestData)
  // console.log(JSON.stringify(harvestData, null, 2))
  // console.log(JSON.stringify(harvestPayload, null, 2))

  await fetch(`${process.env.SLACK_APP_WEBHOOK_URL}`, {
    method: 'POST',
    body: JSON.stringify({
      "blocks": harvestPayload
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
