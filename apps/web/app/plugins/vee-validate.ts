import { defineRule, configure } from 'vee-validate'
import * as Rules from '@vee-validate/rules'
import { localize, setLocale } from '@vee-validate/i18n'
import pt_BR from '@vee-validate/i18n/dist/locale/pt_BR.json'
import FormsFieldNames from '../support/FormsFieldsNames'

export default defineNuxtPlugin(() => {
  Object.keys(Rules).forEach((rule: string) => {
    if (Rules[rule] instanceof Function) defineRule(rule, Rules[rule])
  })

  defineRule('strongPassword', (value: string) => {
    if (!value || !value.length) {
      return true
    }
    if (!/^(?=.*[0-9])(?=.*[!@#$%^&])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&]{8,22}$/.test(value)) {
      return 'A senha deve conter no mínimo 8 caracteres e pelo menos um número, um caractere especial, um maiúsculo e um minúsculo.'
    }
    return true
  })

  defineRule('mindate', (value = '', [target] = '') => {
    if (!value || !target) return true

    const dateFrom = target.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')
    const dateTo = value.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3')

    if (new Date(dateTo) > new Date(dateFrom)) {
      return true
    }
    return 'A data final deve ser posterior a data de início.'
  })
})

localize({ pt_BR })

configure({
  validateOnBlur: true,
  validateOnChange: true,
  validateOnInput: true,
  validateOnModelUpdate: true,
  generateMessage: localize('pt_BR', {
    names: FormsFieldNames,
    messages: {
      confirmed: 'O campo deve ser igual a senha.'
    }
  })
})

setLocale('pt_BR')
