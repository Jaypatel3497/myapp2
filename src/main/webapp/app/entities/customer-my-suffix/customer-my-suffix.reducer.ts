import axios from 'axios';
import { ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { SERVER_API_URL } from 'app/config/constants';

import { ICustomerMySuffix, defaultValue } from 'app/shared/model/customer-my-suffix.model';

export const ACTION_TYPES = {
  FETCH_CUSTOMER_LIST: 'customer/FETCH_CUSTOMER_LIST',
  FETCH_CUSTOMER: 'customer/FETCH_CUSTOMER',
  CREATE_CUSTOMER: 'customer/CREATE_CUSTOMER',
  UPDATE_CUSTOMER: 'customer/UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'customer/DELETE_CUSTOMER',
  RESET: 'customer/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ICustomerMySuffix>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type CustomerMySuffixState = Readonly<typeof initialState>;

// Reducer

export default (state: CustomerMySuffixState = initialState, action): CustomerMySuffixState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.FETCH_CUSTOMER_LIST):
    case REQUEST(ACTION_TYPES.FETCH_CUSTOMER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_CUSTOMER):
    case REQUEST(ACTION_TYPES.UPDATE_CUSTOMER):
    case REQUEST(ACTION_TYPES.DELETE_CUSTOMER):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.FETCH_CUSTOMER_LIST):
    case FAILURE(ACTION_TYPES.FETCH_CUSTOMER):
    case FAILURE(ACTION_TYPES.CREATE_CUSTOMER):
    case FAILURE(ACTION_TYPES.UPDATE_CUSTOMER):
    case FAILURE(ACTION_TYPES.DELETE_CUSTOMER):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.FETCH_CUSTOMER_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_CUSTOMER):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_CUSTOMER):
    case SUCCESS(ACTION_TYPES.UPDATE_CUSTOMER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_CUSTOMER):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = SERVER_API_URL + '/api/customers';

// Actions

export const getEntities: ICrudGetAllAction<ICustomerMySuffix> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_CUSTOMER_LIST,
  payload: axios.get<ICustomerMySuffix>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ICustomerMySuffix> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_CUSTOMER,
    payload: axios.get<ICustomerMySuffix>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ICustomerMySuffix> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_CUSTOMER,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ICustomerMySuffix> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_CUSTOMER,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ICustomerMySuffix> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_CUSTOMER,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
