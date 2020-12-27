import { FieldsConfiguration } from 'FormO4000/reducer';

function isValidEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
}

export const FIELDS: FieldsConfiguration = {
  name: {
    type: 'text',
    label: 'Full name',
    isValid: (value) => {
      return Boolean(value);
    },
  },
  email: {
    type: 'text',
    label: 'Email address',
    isValid: (value) => {
      return isValidEmail(value);
    },
  },
  job: {
    type: 'select',
    options: [
      { value: 'adsadasd', text: 'Adasdasd' },
      { value: 'ergsdgdhe', text: 'ergsdgdhe' },
      { value: 'oeilkvsd', text: 'oeilkvsd' },
    ],
    label: "I'm a...",
    isValid: (value) => {
      return Boolean(value);
    },
  },
  interest: {
    type: 'select',
    options: [
      { value: 'adsadasd', text: 'Adasdasd' },
      { value: 'ergsdgdhe', text: 'ergsdgdhe' },
      { value: 'oeilkvsd', text: 'oeilkvsd' },
    ],
    label: "I'm interested in...",
    isValid: (value) => {
      return Boolean(value);
    },
  },
};
