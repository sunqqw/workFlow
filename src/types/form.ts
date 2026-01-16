export interface FormField {
  id: string
  type: 'input' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload' | 'group'
  label: string
  field: string
  required: boolean
  placeholder?: string
  defaultValue?: any
  options?: { label: string; value: string | number }[] // For select/radio/checkbox
  children?: FormField[] // For group
  layout?: {
    width: '50%' | '100%'
  }
  validation?: {
    type?: 'email' | 'url' | 'phone'
    min?: number
    max?: number
    pattern?: string
  }
}

export interface FormTemplate {
  id: string
  name: string
  description?: string
  config: {
    labelPosition: 'top' | 'left' | 'right'
    submitText: string
    layout: 'single' | 'double'
  }
  fields: FormField[]
  createdAt: number
  updatedAt: number
}
