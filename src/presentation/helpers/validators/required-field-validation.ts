import { MissingPararmError } from '@/presentation/errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor(fieldName: string) {
    this.fieldName = fieldName
  }

  validate(input: any): Error | undefined {
    if (!input[this.fieldName]) return new MissingPararmError(this.fieldName)
  }
}
