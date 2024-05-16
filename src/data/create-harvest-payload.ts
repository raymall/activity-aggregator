
import type { HarvestData, HarvestDataEntry, HarvestError } from '../io'
import { formatHours } from '../utils/format-hours'
import {
  slackSection,
  slackDivider,
  slackText,
  slackContext,
  slackRichTextList,
  slackLink,
  slackRichTextSection,
  slackRichText
} from '../utils/format-slack-message'

export async function createHarvestPayload(harvestData: HarvestData[] | HarvestError) {
  const harvestPayload = []

  if ('error' in harvestData) {
    // harvestPayload.push(slackSection(`Hi team! \n*_No Harvest time entries found for <@UKDM34WQ1>_* today`))
    harvestPayload.push(slackSection(`Hi team! \n*_No Harvest time entries found for Raymall-${Math.random()}_* today`))

    return harvestPayload
  }

  // harvestPayload.push(slackSection('Hi team! \n_Today <@UKDM34WQ1> worked on:_'))
  harvestPayload.push(slackSection(`Hi team! \n_Today Raymall-${Math.random()} worked on:_`))
  
  harvestData
    .map((client, index) => {
      harvestPayload.push(slackSection(`*${client.client}*`))
      
      if (client.entries.length) {
        const clientEntries = client.entries
          .map((entry:HarvestDataEntry) => {
            const entry_hours = slackText(`(${formatHours(entry.hours)})`, { bold: true, italic: true })


            const entryItem = 
              slackRichTextSection(
                (
                  entry.reference ?
                    slackLink(`${entry.title}`, entry.reference, { bold: true })
                    :
                    slackText(`${entry.title}`, { bold: true })
                ),
                slackText(` - ${entry.task} `),
                entry_hours
              )
  
            return entryItem
          })

        const clientProjects = client.entries
          .reduce((accumulator: string[], item:HarvestDataEntry) => {
            if (!accumulator.includes(item.project)) {
              accumulator.push(item.project)
            }

            return accumulator
          }, []).join(', ')

        harvestPayload.push(
          slackRichText(slackRichTextList(clientEntries)),
          slackContext(`*${clientProjects}*`)
        )
      }

      if (index < harvestData.length - 1) {
        harvestPayload.push(slackDivider())
      }
    })

  return harvestPayload
}