import axios from 'axios';
import { expect } from 'chai';
import configureStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import * as sinon from 'sinon';

import reducer, {
  ACTION_TYPES,
  createEntity,
  deleteEntity,
  getEntities,
  getEntity,
  updateEntity
} from 'app/entities/cancellation-policy-my-suffix/cancellation-policy-my-suffix.reducer';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';
import { ICancellationPolicyMySuffix, defaultValue } from 'app/shared/model/cancellation-policy-my-suffix.model';

// tslint:disable no-invalid-template-strings
describe('Entities reducer tests', () => {
  function isEmpty(element): boolean {
    if (element instanceof Array) {
      return element.length === 0;
    } else {
      return Object.keys(element).length === 0;
    }
  }

  const initialState = {
    loading: false,
    errorMessage: null,
    entities: [] as ReadonlyArray<ICancellationPolicyMySuffix>,
    entity: defaultValue,
    updating: false,
    updateSuccess: false
  };

  function testInitialState(state) {
    expect(state).to.contain({
      loading: false,
      errorMessage: null,
      updating: false,
      updateSuccess: false
    });
    expect(isEmpty(state.entities));
    expect(isEmpty(state.entity));
  }

  function testMultipleTypes(types, payload, testFunction) {
    types.forEach(e => {
      testFunction(reducer(undefined, { type: e, payload }));
    });
  }

  describe('Common', () => {
    it('should return the initial state', () => {
      testInitialState(reducer(undefined, {}));
    });
  });

  describe('Requests', () => {
    it('should set state to loading', () => {
      testMultipleTypes(
        [REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST), REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY)],
        {},
        state => {
          expect(state).to.contain({
            errorMessage: null,
            updateSuccess: false,
            loading: true
          });
        }
      );
    });

    it('should set state to updating', () => {
      testMultipleTypes(
        [
          REQUEST(ACTION_TYPES.CREATE_CANCELLATIONPOLICY),
          REQUEST(ACTION_TYPES.UPDATE_CANCELLATIONPOLICY),
          REQUEST(ACTION_TYPES.DELETE_CANCELLATIONPOLICY)
        ],
        {},
        state => {
          expect(state).to.contain({
            errorMessage: null,
            updateSuccess: false,
            updating: true
          });
        }
      );
    });
  });

  describe('Failures', () => {
    it('should set a message in errorMessage', () => {
      testMultipleTypes(
        [
          FAILURE(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          FAILURE(ACTION_TYPES.FETCH_CANCELLATIONPOLICY),
          FAILURE(ACTION_TYPES.CREATE_CANCELLATIONPOLICY),
          FAILURE(ACTION_TYPES.UPDATE_CANCELLATIONPOLICY),
          FAILURE(ACTION_TYPES.DELETE_CANCELLATIONPOLICY)
        ],
        'error message',
        state => {
          expect(state).to.contain({
            errorMessage: 'error message',
            updateSuccess: false,
            updating: false
          });
        }
      );
    });
  });

  describe('Successes', () => {
    it('should fetch all entities', () => {
      const payload = { data: { 1: 'fake1', 2: 'fake2' } };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          payload
        })
      ).to.eql({
        ...initialState,
        loading: false,
        entities: payload.data
      });
    });

    it('should create/update entity', () => {
      const payload = { data: 'fake payload' };
      expect(
        reducer(undefined, {
          type: SUCCESS(ACTION_TYPES.CREATE_CANCELLATIONPOLICY),
          payload
        })
      ).to.eql({
        ...initialState,
        updating: false,
        updateSuccess: true,
        entity: payload.data
      });
    });

    it('should delete entity', () => {
      const payload = 'fake payload';
      const toTest = reducer(undefined, {
        type: SUCCESS(ACTION_TYPES.DELETE_CANCELLATIONPOLICY),
        payload
      });
      expect(toTest).to.contain({
        updating: false,
        updateSuccess: true
      });
    });
  });

  describe('Actions', () => {
    let store;

    const resolvedObject = { value: 'whatever' };
    beforeEach(() => {
      const mockStore = configureStore([thunk, promiseMiddleware()]);
      store = mockStore({});
      axios.get = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.post = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.put = sinon.stub().returns(Promise.resolve(resolvedObject));
      axios.delete = sinon.stub().returns(Promise.resolve(resolvedObject));
    });

    it('dispatches ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getEntities()).then(() => expect(store.getActions()).to.eql(expectedActions));
    });

    it('dispatches ACTION_TYPES.FETCH_CANCELLATIONPOLICY actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY),
          payload: resolvedObject
        }
      ];
      await store.dispatch(getEntity(42666)).then(() => expect(store.getActions()).to.eql(expectedActions));
    });

    it('dispatches ACTION_TYPES.CREATE_CANCELLATIONPOLICY actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.CREATE_CANCELLATIONPOLICY)
        },
        {
          type: SUCCESS(ACTION_TYPES.CREATE_CANCELLATIONPOLICY),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(createEntity({ id: 1 })).then(() => expect(store.getActions()).to.eql(expectedActions));
    });

    it('dispatches ACTION_TYPES.UPDATE_CANCELLATIONPOLICY actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.UPDATE_CANCELLATIONPOLICY)
        },
        {
          type: SUCCESS(ACTION_TYPES.UPDATE_CANCELLATIONPOLICY),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(updateEntity({ id: 1 })).then(() => expect(store.getActions()).to.eql(expectedActions));
    });

    it('dispatches ACTION_TYPES.DELETE_CANCELLATIONPOLICY actions', async () => {
      const expectedActions = [
        {
          type: REQUEST(ACTION_TYPES.DELETE_CANCELLATIONPOLICY)
        },
        {
          type: SUCCESS(ACTION_TYPES.DELETE_CANCELLATIONPOLICY),
          payload: resolvedObject
        },
        {
          type: REQUEST(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST)
        },
        {
          type: SUCCESS(ACTION_TYPES.FETCH_CANCELLATIONPOLICY_LIST),
          payload: resolvedObject
        }
      ];
      await store.dispatch(deleteEntity(42666)).then(() => expect(store.getActions()).to.eql(expectedActions));
    });
  });
});
