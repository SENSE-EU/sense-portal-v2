import { FormComputeData } from './_types'
import { getComputeResourceLimits } from './computeEnvironmentDefaults'

type ComputeResourceValues = Pick<
  FormComputeData,
  | 'computeEnv'
  | 'mode'
  | 'cpu'
  | 'ram'
  | 'disk'
  | 'gpu'
  | 'jobDuration'
  | 'queueWaitingEnabled'
  | 'queueMaxWaitTime'
>

export function isComputeEnvironmentConfigured(
  values: ComputeResourceValues
): boolean {
  const isFree = values.mode !== 'paid'
  const queueWaitTimeValid =
    !values.queueWaitingEnabled || Number(values.queueMaxWaitTime) > 0

  const cpuLimits = getComputeResourceLimits(values.computeEnv, 'cpu', isFree)
  const ramLimits = getComputeResourceLimits(values.computeEnv, 'ram', isFree)
  const diskLimits = getComputeResourceLimits(values.computeEnv, 'disk', isFree)
  const gpuLimits = getComputeResourceLimits(values.computeEnv, 'gpu', isFree)
  const jobDurationLimits = getComputeResourceLimits(
    values.computeEnv,
    'jobDuration',
    isFree
  )

  return (
    Number(values.cpu) >= cpuLimits.minValue &&
    Number(values.ram) >= ramLimits.minValue &&
    Number(values.disk) >= diskLimits.minValue &&
    Number(values.gpu) >= gpuLimits.minValue &&
    Number(values.jobDuration) >= jobDurationLimits.minValue &&
    queueWaitTimeValid
  )
}
