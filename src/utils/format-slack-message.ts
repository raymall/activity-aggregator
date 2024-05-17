import type { SlackBlock } from '../io'

export const slackSection = (text: string) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text
  }
})

export const slackHeader = (text: string) => ({
  type: 'header',
  text: {
    type: 'plain_text',
    text
  }
})

export const slackRichTextSection = (...args: SlackBlock[]) => ({
  type: 'rich_text_section',
  elements: [
    ...args
  ]
})

export const slackText = (
  text: string,
  style?: {
    italic?: true,
    bold?: true
  }
) => ({
  type: 'text',
  text,
  style
})

export const slackRichText = (...args: SlackBlock[]) => ({
  type: 'rich_text',
  elements: [
    ...args
  ]
})

export const slackLink = (
  text: string,
  url: string,
  style?: {
    italic?: true,
    bold?: true
  }
) => ({
  type: 'link',
  url,
  text,
  style
})

export const slackRichTextList = (entries: SlackBlock[]) => ({
  type: 'rich_text_list',
  style: 'bullet',
  elements: entries
})

export const slackContext = (text: string) => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text
    }
  ]
})

export const slackDivider = () => ({
  type: 'divider'
})