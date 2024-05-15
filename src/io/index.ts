export type HarvestError = {
  error: boolean
  status: number
  statusText: string
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

export type Entry = {
  client: string
  project: string
  title: string
  task: string
  reference: string
  hours: number
}

export type HarvestDataEntry = Omit<Entry, 'client'> & {
  client?: string
}

export type HarvestData = {
  client: string
  entries: HarvestDataEntry[]
}