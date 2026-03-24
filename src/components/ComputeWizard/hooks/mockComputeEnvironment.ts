import { ComputeEnvironment } from '@oceanprotocol/lib'

function adjustResourceCapacity(
  value: number | undefined,
  fallback: number
): number {
  if (typeof value !== 'number') return fallback
  if (value <= 1) return value

  return Math.max(1, Number((value / 2).toFixed(1)))
}

function cloneResourceLimits(
  resources?: ComputeEnvironment['resources']
): ComputeEnvironment['resources'] {
  return resources?.map((resource) => ({
    ...resource,
    total: adjustResourceCapacity(resource.total, resource.total ?? 1),
    max: adjustResourceCapacity(
      resource.max,
      adjustResourceCapacity(resource.total, 1)
    ),
    inUse: 0
  }))
}

export function appendMockComputeEnvironment(
  environments: ComputeEnvironment[]
): ComputeEnvironment[] {
  if (!environments?.length) return environments

  const baseEnvironment = environments[0]
  const mockEnvironmentId = `${baseEnvironment.id}-mock-local`

  if (
    environments.some((environment) => environment.id === mockEnvironmentId)
  ) {
    return environments
  }

  const mockEnvironment: ComputeEnvironment = {
    ...baseEnvironment,
    id: mockEnvironmentId,
    description: 'Local mock environment for C2D wizard testing.',
    maxJobDuration: Math.max(
      1800,
      Math.floor((baseEnvironment.maxJobDuration ?? 3600) / 2)
    ),
    resources: cloneResourceLimits(baseEnvironment.resources),
    free: baseEnvironment.free
      ? {
          ...baseEnvironment.free,
          maxJobDuration: Math.max(
            900,
            Math.floor((baseEnvironment.free.maxJobDuration ?? 1800) / 2)
          ),
          resources: cloneResourceLimits(baseEnvironment.free.resources)
        }
      : undefined
  }

  return [...environments, mockEnvironment]
}
