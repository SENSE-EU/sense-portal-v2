export interface ResourceType {
  cpu: number
  ram: number
  disk: number
  jobDuration: number
  price: number | string
  mode: string
  gpu?: number
  fullJobPrice?: string
  actualPaymentAmount?: string
  escrowCoveredAmount?: string
}
