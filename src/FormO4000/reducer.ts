import { ACTIONS, RESET, STATUSES, SUBMISSION_ERROR, UPDATE_FIELDS } from './constants';

export type Field = {
  value?: string;
  valid: boolean;
  status: string;
};

type Fields = {
  [key: string]: Field;
};

export type FieldsConfiguration = {
  [key: string]: {
    type: string;
    label: string;
    isValid: (x: any) => boolean;
    options?: { value: string; text: string }[];
  };
};

export type ReducerState = {
  errors: {
    inFields: boolean;
    submission: boolean;
  };
  status: string;
  fields: Fields;
};

export type ReducerAction = {
  type: string;
  payload?: {
    fieldsConfiguration?: FieldsConfiguration;
    fieldsKeys?: string[];
    isValid?: (x: any) => boolean;
    name?: string;
    value?: string;
  };
};

export const INITIAL_STATE: ReducerState = {
  errors: {
    inFields: false,
    submission: false,
  },
  status: STATUSES.UNINITIALISED,
  fields: {},
};

export const initialiseState = function initialiseState({
  fieldsConfiguration,
  fieldsKeys,
  initialState = INITIAL_STATE,
}: {
  fieldsConfiguration: FieldsConfiguration;
  fieldsKeys: string[];
  initialState?: ReducerState;
}): ReducerState {
  // Only adding new fields works in this implementation. Removal will not work.
  // However even adding new fields is a stretch, so we are not going to bother
  // with proper removal of fields right now.
  const fieldsState = fieldsKeys.reduce(
    (acc, key) => {
      // Retain values of existing fields
      if (!acc.fields[key]) {
        const initialValue = '';
        const currentFieldIsValid = fieldsConfiguration[key].isValid(initialValue);

        // If the new field is invalid mark the whole form as having field errors
        acc.errorsInFields = !currentFieldIsValid;
        acc.fields[key] = {
          value: initialValue,
          status: STATUSES.UNINITIALISED,
          valid: currentFieldIsValid,
        };
      }

      return acc;
    },

    { fields: { ...initialState?.fields }, errorsInFields: false }
  );

  return {
    ...initialState,
    errors: {
      ...initialState.errors,
      inFields: fieldsState.errorsInFields,
    },
    fields: fieldsState.fields,
  };
};

function errorsInFieldsReducer(fields: Fields, currentFieldIsValid: boolean) {
  // Immediately bail if current value is invalid
  if (!currentFieldIsValid) {
    return true;
  }

  // Else check fields until one invalid is found
  for (const field in fields) {
    if (Object.hasOwnProperty.call(fields, field)) {
      if (!fields[field].valid) {
        return true;
      }
    }
  }

  return false;
}

export function reducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case RESET:
      if (!action.payload) {
        throw new Error('Payload should be defined');
      }

      if (!action.payload.fieldsConfiguration) {
        throw new Error('fieldsConfiguration should be defined');
      }

      if (!action.payload.fieldsKeys) {
        throw new Error('fieldsKeys should be defined');
      }

      return initialiseState({
        fieldsConfiguration: action.payload.fieldsConfiguration,
        fieldsKeys: action.payload.fieldsKeys,
      });
    case UPDATE_FIELDS:
      if (!action.payload) {
        throw new Error('Payload should be defined');
      }

      if (!action.payload.fieldsConfiguration) {
        throw new Error('fieldsConfiguration should be defined');
      }

      if (!action.payload.fieldsKeys) {
        throw new Error('fieldsKeys should be defined');
      }

      return initialiseState({
        fieldsConfiguration: action.payload.fieldsConfiguration,
        fieldsKeys: action.payload.fieldsKeys,
        initialState: state,
      });

    case SUBMISSION_ERROR:
      return {
        ...state,
        status: STATUSES.TOUCHED,
        errors: {
          ...state.errors,
          submission: true,
        },
      };
    case ACTIONS.SUBMIT:
      return {
        ...state,
        status: STATUSES.SUBMITTING,
      };
    case ACTIONS.FOCUSED:
      if (!action.payload) {
        throw new Error('Payload should be defined');
      }

      if (!action.payload.name) {
        throw new Error('Name should be defined');
      }

      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.name]: {
            ...state.fields[action.payload.name],
          },
        },
      };
    case ACTIONS.BLURRED: {
      if (!action.payload) {
        throw new Error('Payload should be defined');
      }

      if (!action.payload.name) {
        throw new Error('Name should be defined');
      }

      if (!action.payload.isValid) {
        throw new Error('Validation check should be defined');
      }

      const currentFieldIsValid = action.payload.isValid(state.fields[action.payload.name].value);
      const newFieldsState = {
        ...state.fields,
        [action.payload.name]: {
          ...state.fields[action.payload.name],
          status: STATUSES.TOUCHED,
          valid: currentFieldIsValid,
        },
      };

      return {
        ...state,
        status: STATUSES.TOUCHED,
        errors: {
          ...state.errors,
          inFields: errorsInFieldsReducer(newFieldsState, currentFieldIsValid),
        },
        fields: newFieldsState,
      };
    }
    case ACTIONS.CHANGED: {
      if (!action.payload) {
        throw new Error('Payload should be defined');
      }

      if (!action.payload.name) {
        throw new Error('Name should be defined');
      }

      if (!action.payload.isValid) {
        throw new Error('Validation check should be defined');
      }

      const currentFieldIsValid = action.payload.isValid(action.payload.value);
      const newFieldsState = {
        ...state.fields,
        [action.payload.name]: {
          ...state.fields[action.payload.name],
          value: action.payload.value,
          valid: currentFieldIsValid,
        },
      };

      return {
        ...state,
        errors: {
          ...state.errors,
          inFields: errorsInFieldsReducer(newFieldsState, currentFieldIsValid),
        },
        fields: newFieldsState,
      };
    }
    default:
      return state;
  }
}
