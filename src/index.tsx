import Form from 'demo/Form';
import { FIELDS } from 'demo/form-config';
import { FormProvider } from 'FormO4000';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <FormProvider fieldsConfiguration={FIELDS}>
      <Form />
    </FormProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
