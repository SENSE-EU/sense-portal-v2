import { ReactElement, useState, useEffect, useCallback } from 'react'
import { useFormikContext } from 'formik'
import { ComputeEnvironment, ProviderInstance } from '@oceanprotocol/lib'
import StepTitle from '@shared/StepTitle'
import EnvironmentSelection from '@shared/FormInput/InputElement/EnvironmentSelection'
import { FormComputeData } from '../_types'
import { LAST_TRACKED_COMPLETION_STEP } from '../_steps'
import { ResourceType } from 'src/@types/ResourceType'
import styles from './index.module.css'
import appConfig from 'app.config.cjs'

interface SelectEnvironmentProps {
  computeEnvs: ComputeEnvironment[]
  providerUrl?: string
  setAllResourceValues?: React.Dispatch<
    React.SetStateAction<Record<string, ResourceType>>
  >
}

const { customProviderUrl } = appConfig
const downstreamStepOffsets = [1, 2, 3] as const
const resetEnvironmentSelectionValues = {
  cpu: 0,
  ram: 0,
  disk: 0,
  gpu: 0,
  jobDuration: 0,
  jobPrice: '0',
  escrowFunds: '0',
  actualPaymentAmount: '0',
  escrowCoveredAmount: '0',
  baseToken: null
} as const

function createResetResourceValues(mode: 'free' | 'paid'): ResourceType {
  return {
    cpu: 0,
    ram: 0,
    disk: 0,
    gpu: 0,
    jobDuration: 0,
    mode,
    price: '0',
    fullJobPrice: '0',
    actualPaymentAmount: '0',
    escrowCoveredAmount: '0'
  }
}

export default function SelectEnvironment({
  computeEnvs,
  providerUrl,
  setAllResourceValues
}: SelectEnvironmentProps): ReactElement {
  const { values, setFieldValue } = useFormikContext<FormComputeData>()
  const [selectedEnvId, setSelectedEnvId] = useState<string>()
  const providerUrlForNodeInfo = providerUrl || customProviderUrl

  useEffect(() => {
    if (values.computeEnv?.id) {
      setSelectedEnvId(values.computeEnv.id)
    }
  }, [values.computeEnv])

  const handleEnvironmentSelect = useCallback(
    async (envId: string) => {
      setSelectedEnvId(envId)
      const availableEnvs =
        computeEnvs?.length > 0
          ? computeEnvs
          : await ProviderInstance.getComputeEnvironments(
              providerUrlForNodeInfo
            )
      const selectedEnv = availableEnvs.find((env) => env.id === envId)
      if (selectedEnv) {
        const previousEnvId = values.computeEnv?.id
        const hasEnvironmentChanged = previousEnvId && previousEnvId !== envId

        if (hasEnvironmentChanged) {
          setFieldValue('mode', selectedEnv.free ? 'free' : 'paid')
          Object.entries(resetEnvironmentSelectionValues).forEach(
            ([field, value]) => {
              setFieldValue(field, value)
            }
          )
          downstreamStepOffsets.forEach((offset) => {
            const dependentStep = values.user.stepCurrent + offset
            if (
              dependentStep <= LAST_TRACKED_COMPLETION_STEP &&
              dependentStep !== 6
            ) {
              setFieldValue(`step${dependentStep}Completed`, false)
            }
          })

          setAllResourceValues?.((prev) => ({
            ...prev,
            [`${selectedEnv.id}_free`]: createResetResourceValues('free'),
            [`${selectedEnv.id}_paid`]: createResetResourceValues('paid')
          }))
        }

        setFieldValue('computeEnv', selectedEnv)
      }
    },
    [
      computeEnvs,
      providerUrlForNodeInfo,
      setAllResourceValues,
      setFieldValue,
      values.computeEnv?.id,
      values.user.stepCurrent
    ]
  )

  return (
    <>
      <StepTitle title="Select C2D Environment" />

      <div className={styles.environmentSelection}>
        <EnvironmentSelection
          environments={computeEnvs}
          selected={selectedEnvId}
          nodeUrl={providerUrlForNodeInfo}
          onChange={handleEnvironmentSelect}
        />
      </div>
    </>
  )
}
