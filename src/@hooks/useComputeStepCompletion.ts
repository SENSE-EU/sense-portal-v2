import { useFormikContext } from 'formik'
import { FormComputeData } from '@components/ComputeWizard/_types'
import { getDatasetSteps } from '@components/ComputeWizard/_steps'
import { getOutputStorageValidationMessage } from '@components/ComputeWizard/outputStorage'

type StepCompletedKey = Extract<keyof FormComputeData, `step${number}Completed`>

export function useComputeStepCompletion() {
  const { values } = useFormikContext<FormComputeData>()
  const hasUserParamsStep = Boolean(values.isUserParameters)
  const withoutDataset = Boolean(values.withoutDataset)
  const steps = getDatasetSteps(hasUserParamsStep, withoutDataset)
  const totalSteps = steps.length
  function getSuccessClass(step: number): boolean {
    const stepTitle = steps.find((item) => item.step === step)?.title
    const environmentSelected = Boolean(values.computeEnv)
    const configSet =
      Number(values.cpu) > 0 &&
      Number(values.ram) > 0 &&
      Number(values.disk) > 0 &&
      Number(values.gpu) >= 0 &&
      Number(values.jobDuration) > 0
    const outputStorageConfigured = !getOutputStorageValidationMessage(
      values.outputStorageEnabled,
      values.outputStorage
    )
    const agreementsChecked = Boolean(
      values.termsAndConditions && values.acceptPublishingLicense
    )
    const stepKey = `step${step}Completed` as StepCompletedKey
    const explicitStepComplete = Boolean(values[stepKey])

    switch (stepTitle) {
      case 'Select Datasets':
        return Boolean(values.step1Completed || (values.datasets?.length ?? 0))
      case 'Select Algorithm':
        return Boolean(values.step1Completed || values.algorithm)
      case 'Select Services':
        return Boolean(
          explicitStepComplete ||
            values.serviceSelected ||
            (values.algorithmServices?.length ?? 0) > 0
        )
      case 'Preview Selected Datasets & Services':
      case 'User Parameters':
        return explicitStepComplete
      case 'Select C2D Environment':
        return Boolean(explicitStepComplete || environmentSelected)
      case 'C2D Environment Configuration':
        return Boolean(explicitStepComplete || configSet)
      case 'Job Results Storage':
        return explicitStepComplete
      case 'Review':
        return Boolean(
          explicitStepComplete ||
            (environmentSelected &&
              configSet &&
              outputStorageConfigured &&
              agreementsChecked)
        )
      default:
        return false
    }
  }

  function getLastCompletedStep() {
    let lastCompletedStep = 0
    for (let i = 1; i <= totalSteps; i++) {
      if (getSuccessClass(i)) {
        lastCompletedStep = i
      } else {
        break
      }
    }
    return lastCompletedStep
  }

  return { getSuccessClass, getLastCompletedStep, totalSteps }
}
