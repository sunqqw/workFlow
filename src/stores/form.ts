import { defineStore } from 'pinia'
import type { FormTemplate, FormField } from '@/types/form'

export const useFormStore = defineStore('form', {
  state: () => ({
    currentForm: null as FormTemplate | null,
    selectedField: null as FormField | null,
    forms: [] as FormTemplate[] // Local storage mock
  }),
  actions: {
    initForm() {
      const id = Date.now().toString()
      this.currentForm = {
        id,
        name: 'New Form',
        config: {
          labelPosition: 'top',
          submitText: 'Submit',
          layout: 'single'
        },
        fields: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    },

    setForm(form: FormTemplate) {
      this.currentForm = form
    },

    addField(type: FormField['type'], parentId?: string) {
      if (!this.currentForm) return

      const id = Date.now().toString()
      const field: FormField = {
        id,
        type,
        label: `New ${type}`,
        field: `field_${id}`,
        required: false,
        layout: { width: '100%' },
        children: type === 'group' ? [] : undefined
      }

      // Default options for selection types
      if (['select', 'radio', 'checkbox'].includes(type)) {
          field.options = [
              { label: 'Option 1', value: 'option1' },
              { label: 'Option 2', value: 'option2' }
          ]
      }

      if (parentId) {
          // Add to group (nested) - simplified search for demo
          const findGroup = (fields: FormField[]): FormField | undefined => {
              for (const f of fields) {
                  if (f.id === parentId) return f
                  if (f.children) {
                      const found = findGroup(f.children)
                      if (found) return found
                  }
              }
          }
          const group = findGroup(this.currentForm.fields)
          if (group && group.children) {
              group.children.push(field)
          }
      } else {
          this.currentForm.fields.push(field)
      }
      
      this.currentForm.updatedAt = Date.now()
      this.selectedField = field
    },

    removeField(id: string) {
      if (!this.currentForm) return
      
      const remove = (fields: FormField[]) => {
          const index = fields.findIndex(f => f.id === id)
          if (index > -1) {
              fields.splice(index, 1)
              return true
          }
          for (const f of fields) {
              if (f.children && remove(f.children)) return true
          }
          return false
      }

      remove(this.currentForm.fields)
      
      if (this.selectedField?.id === id) {
        this.selectedField = null
      }
      this.currentForm.updatedAt = Date.now()
    },

    selectField(field: FormField | null) {
      this.selectedField = field
    },

    updateFieldConfig(id: string, config: Partial<FormField>) {
        if (!this.currentForm) return
        
        const update = (fields: FormField[]) => {
            const field = fields.find(f => f.id === id)
            if (field) {
                Object.assign(field, config)
                return true
            }
            for (const f of fields) {
                if (f.children && update(f.children)) return true
            }
            return false
        }
        
        if (update(this.currentForm.fields)) {
            this.currentForm.updatedAt = Date.now()
        }
    },
    
    updateFormConfig(config: Partial<FormTemplate['config']>) {
        if (!this.currentForm) return
        Object.assign(this.currentForm.config, config)
        this.currentForm.updatedAt = Date.now()
    }
  }
})
