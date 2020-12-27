import React, { ReactElement, useCallback, useEffect, useMemo, useReducer } from 'react';
import { ACTIONS, RESET, STATUSES, SUBMISSION_ERROR, UPDATE_FIELDS } from './constants';
import type { Field, FieldsConfiguration, ReducerState } from './reducer';
import { INITIAL_STATE, initialiseState, reducer } from './reducer';

export type ProviderValue = {
  form: ReducerState;
  fieldsKeys: string[];
  getFieldConfiguration: (name: string) => any;
  getFieldState: (name: string) => Field;
  getFieldDispatches: (fieldName: string) => any;
  dispatchSubmit: () => void;
  dispatchSubmissionError: () => void;
  dispatchReset: () => void;
  clearToSubmit: boolean;
  submitting: boolean;
  uninitialized: boolean;
};

const FormContext = React.createContext<ProviderValue>(
  new Proxy(
    {
      form: INITIAL_STATE,
      fieldsKeys: [],
      getFieldConfiguration: (name) => {},
      getFieldState: (name) => ({
        value: '',
        valid: false,
        status: '',
      }),
      getFieldDispatches: (fieldName) => {},
      dispatchSubmit: () => {},
      dispatchSubmissionError: () => {},
      dispatchReset: () => {},
      clearToSubmit: false,
      submitting: false,
      uninitialized: true,
    },
    {
      apply: () => {
        throw new Error('You must wrap your component in an FormProvider');
      },
      get: () => {
        throw new Error('You must wrap your component in an FormProvider');
      },
    }
  )
);

export type Props = {
  children: ReactElement;
  fieldsConfiguration: FieldsConfiguration;
};

function FormProvider(props: Props) {
  const { children, fieldsConfiguration } = props;
  const fieldsKeys = useMemo(() => {
    return Object.keys(fieldsConfiguration);
  }, [fieldsConfiguration]);

  const [form, dispatch] = useReducer(reducer, INITIAL_STATE, (initialState) => {
    return initialiseState({ fieldsConfiguration, fieldsKeys, initialState });
  });

  const submitting = form.status === STATUSES.SUBMITTING;
  const uninitialized = form.status === STATUSES.UNINITIALISED;
  const clearToSubmit = !(form.errors.inFields || uninitialized || submitting);

  const getFieldConfiguration = useCallback(
    function getFieldConfiguration(name) {
      return fieldsConfiguration[name];
    },
    [fieldsConfiguration]
  );

  const getFieldState = useCallback(
    function getFieldState(name) {
      return form.fields[name];
    },
    [form.fields]
  );

  const fieldDispatches = useMemo(() => {
    return fieldsKeys.reduce((acc, fieldName) => {
      acc[fieldName] = {
        dispatchFocus: function dispatchFocus() {
          dispatch({
            type: ACTIONS.FOCUSED,
            payload: { name: fieldName, isValid: fieldsConfiguration[fieldName].isValid },
          });
        },
        dispatchBlur: function dispatchBlur() {
          dispatch({
            type: ACTIONS.BLURRED,
            payload: { name: fieldName, isValid: fieldsConfiguration[fieldName].isValid },
          });
        },
        dispatchChange: function dispatchChange(e) {
          dispatch({
            type: ACTIONS.CHANGED,
            payload: {
              name: fieldName,
              value: e.target.value,
              isValid: fieldsConfiguration[fieldName].isValid,
            },
          });
        },
      };

      return acc;
    }, {});
  }, [fieldsKeys, fieldsConfiguration]);

  function getFieldDispatches(fieldName) {
    return fieldDispatches[fieldName];
  }

  const dispatchSubmit = useCallback(() => {
    dispatch({ type: ACTIONS.SUBMIT });
  }, []);

  const dispatchSubmissionError = useCallback(() => {
    dispatch({ type: SUBMISSION_ERROR });
  }, []);

  const dispatchReset = useCallback(() => {
    dispatch({ type: RESET, payload: { fieldsConfiguration, fieldsKeys } });
  }, [fieldsConfiguration, fieldsKeys]);

  useEffect(() => {
    dispatch({
      type: UPDATE_FIELDS,
      payload: {
        fieldsConfiguration,
        fieldsKeys,
      },
    });
  }, [fieldsConfiguration, fieldsKeys, dispatch]);

  return (
    <FormContext.Provider
      value={{
        form,
        fieldsKeys,
        getFieldConfiguration,
        getFieldState,
        getFieldDispatches,
        dispatchSubmit,
        dispatchSubmissionError,
        dispatchReset,
        clearToSubmit,
        submitting,
        uninitialized,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

const useForm = () => React.useContext(FormContext);

export { FormProvider, useForm };
