export type Error = {
  error: boolean
  status: number
  statusText: string
}

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

export type HarvestError = Error

export type ClickUpEntry = {
  custom_id?: string | null
  name: string
  status: {
    status: string
    color: string
    orderindex: number
  }
  priority: {
    priority: string
    color: string
    orderindex: number
  }
  url: string
  space: {
    id: string
  }
  time_estimate: number | null
  time_spent: number | undefined
}

export type ClickUpSpace = {
  id: string
  name: string
  color: string
}

export type ClickUpData = ClickUpEntry & {
  space: ClickUpEntry['space'] & {
    name: string
    color: string
  }
}

export type ClickUpError = Error

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