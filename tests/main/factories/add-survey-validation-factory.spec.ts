import { describe, test, expect, vi } from 'vitest'
import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { makeAddSurveyValidation } from '@/main/factories/controllers/survey/add-survey/add-survey-validation-factory'
import { Validation } from '@/presentation/protocols'
vi.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidationFactory', () => {
  test('Should call Validation Composite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
