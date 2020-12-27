import { useForm } from 'FormO4000';
import React, { useState } from 'react';
import Field from './Field.container';

function Form() {
  const {
    form,
    fieldsKeys,
    submitting,
    dispatchSubmit,
    dispatchSubmissionError,
    dispatchReset,
    clearToSubmit,
  } = useForm();

  const submissionErrorOccurred = form.errors.submission;
  const [showMessage, setShowMessage] = useState(false);

  // This is a dummy function for now, until things clear up regarding
  // backend endpoints
  function handleSubmit(e) {
    e.preventDefault();

    if (!clearToSubmit) {
      return;
    }

    dispatchSubmit();

    setTimeout(() => {
      if (Math.random() < 0.5) {
        dispatchSubmissionError();
        setShowMessage(true);
      } else {
        dispatchReset();
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    }, 1000);
  }

  return (
    <div>
      <h3>FORM-O-4000</h3>
      <p>React form #4000 using hooks.</p>

      <div style={{ display: showMessage ? '' : 'none' }}>
        {submissionErrorOccurred ? 'error' : 'success'}
      </div>

      <form onSubmit={handleSubmit}>
        {fieldsKeys.map((key) => {
          // Guard against trying to reach an undefined value during the time
          // when fields prop has been updated but the form state has not been updated yet.
          // Happens when a new field is added.
          if (!form.fields[key]) {
            return null;
          }

          return (
            <div key={key}>
              <Field name={key} />
            </div>
          );
        })}
        <div>
          <button type="submit" disabled={!clearToSubmit}>
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Form;
