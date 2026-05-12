import { ComputeEnvironment } from '@oceanprotocol/lib'
import { ResourceType } from 'src/@types/ResourceType'

type ComputeResourceId = 'cpu' | 'ram' | 'disk' | 'gpu' | 'jobDuration'
type ComputeEnvironmentMode = 'free' | 'paid'

function clamp(value: number, minValue: number, maxValue: number): number {
  return Math.max(minValue, Math.min(maxValue, value))
}

export function getComputeResourceLimits(
  env: ComputeEnvironment | null | undefined,
  id: ComputeResourceId,
  isFree: boolean,
  ignoreInUse = false
): { minValue: number; maxValue: number; step: number } {
  if (!env) return { minValue: 0, maxValue: 0, step: 1 }

  if (id === 'jobDuration') {
    const maxDuration = isFree ? env.free?.maxJobDuration : env.maxJobDuration
    return {
      minValue: 1,
      maxValue: Math.floor((maxDuration ?? 3600) / 60),
      step: 1
    }
  }

  const resourceLimits = isFree ? env.free?.resources : env.resources
  if (!resourceLimits) return { minValue: 0, maxValue: 0, step: 1 }

  const resource =
    id === 'gpu'
      ? resourceLimits.find(
          (item) =>
            item.type === 'gpu' || item.id?.toLowerCase().includes('gpu')
        )
      : resourceLimits.find((item) => item.id === id)

  if (!resource) return { minValue: 0, maxValue: 0, step: 1 }

  const resourceMax = (resource.max || resource.total) ?? 0
  const available = ignoreInUse
    ? resourceMax
    : Math.max(0, resourceMax - (resource.inUse ?? 0))

  return {
    minValue: resource.min ?? 0,
    maxValue: available,
    step: id === 'disk' ? 0.1 : 1
  }
}

export function getDefaultComputeResourceValue(
  env: ComputeEnvironment | null | undefined,
  id: ComputeResourceId,
  isFree: boolean,
  ignoreInUse = false
): number {
  const { minValue, maxValue, step } = getComputeResourceLimits(
    env,
    id,
    isFree,
    ignoreInUse
  )

  if (maxValue <= 0) return 0
  if (id === 'gpu') return clamp(minValue, minValue, maxValue)
  if (id === 'ram' && minValue === 0) return 0

  const minimumAcceptedValue = minValue > 0 ? minValue : step
  return clamp(minimumAcceptedValue, minValue, maxValue)
}

export function createDefaultComputeResourceValues(
  env: ComputeEnvironment,
  mode: ComputeEnvironmentMode,
  ignoreInUse = false
): ResourceType {
  const isFree = mode === 'free'

  return {
    cpu: getDefaultComputeResourceValue(env, 'cpu', isFree, ignoreInUse),
    ram: getDefaultComputeResourceValue(env, 'ram', isFree, ignoreInUse),
    disk: getDefaultComputeResourceValue(env, 'disk', isFree, ignoreInUse),
    gpu: getDefaultComputeResourceValue(env, 'gpu', isFree, ignoreInUse),
    jobDuration: getDefaultComputeResourceValue(
      env,
      'jobDuration',
      isFree,
      ignoreInUse
    ),
    mode,
    price: '0',
    fullJobPrice: '0',
    actualPaymentAmount: '0',
    escrowCoveredAmount: '0'
  }
}
