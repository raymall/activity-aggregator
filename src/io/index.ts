export type HarvestRawEntry = {
  client: string
  project: string
  title: string
  task: string
  reference: string
  hours: number
}

export type HarvestEntry = {
  client: {
    name: string
  }
  project: {
    name: string
  }
  notes: string
  task: {
    name: string
  }
  external_reference?: {
    permalink: string
  }
  hours: number
}

export type HarvestDataEntry = Omit<HarvestRawEntry, 'client'> & {
  client?: string
}

export type HarvestData = {
  client: string
  entries: HarvestDataEntry[]
}

export type HarvestError = {
  error: boolean
  status: number
  statusText: string
}

export type SlackElementBlock = {
  type: string
  text?: string
  url?: string
  style?: {
    italic?: true
    bold?: true
  }
}

export type SlackBlock = {
  type: string
  elements?: SlackElementBlock[]
}