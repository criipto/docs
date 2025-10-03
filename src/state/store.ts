import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  CreateSignatureOrderOutput,
  AddSignatoryOutput,
  CloseSignatureOrderOutput,
} from '../../graphql-signatures-types';
import { ExampleLanguage } from '../examples/misc';

export interface ApiCredentials {
  clientID: string;
  clientSecret: string;
}

function loadCredentials(): ApiCredentials | null {
  if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return null;
  const value = sessionStorage.getItem('graphql_api_credentials');
  if (value) return JSON.parse(value);
  return null;
}

function saveCredentials(input: ApiCredentials) {
  sessionStorage.setItem('graphql_api_credentials', JSON.stringify(input));
}

function clearCredentials() {
  sessionStorage.removeItem('graphql_api_credentials');
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadCredentials(),
  reducers: {
    set: (state: ApiCredentials | null, action: PayloadAction<ApiCredentials>) => {
      saveCredentials(action.payload);
      return action.payload;
    },
    clear: () => {
      clearCredentials();
      return null;
    },
  },
});

export type ExampleData = {
  createSignatureOrder?: CreateSignatureOrderOutput | null;
  closeSignatureOrder?: CloseSignatureOrderOutput | null;
  addSignatory?: AddSignatoryOutput | null;
  language: ExampleLanguage;
};
const exampleDataInitialState: ExampleData = {
  createSignatureOrder: null,
  closeSignatureOrder: null,
  addSignatory: null,
  language: 'graphql',
};
const exampleDataSlice = createSlice({
  name: 'exampleData',
  initialState: exampleDataInitialState,
  reducers: {
    clear: (state: ExampleData) => exampleDataInitialState,
    createSignatureOrder: (
      state: ExampleData,
      action: PayloadAction<CreateSignatureOrderOutput>,
    ) => ({
      ...state,
      createSignatureOrder: action.payload,
    }),
    closeSignatureOrder: (
      state: ExampleData,
      action: PayloadAction<CloseSignatureOrderOutput>,
    ) => ({
      ...state,
      closeSignatureOrder: action.payload,
    }),
    addSignatory: (state: ExampleData, action: PayloadAction<AddSignatoryOutput>) => ({
      ...state,
      addSignatory: action.payload,
    }),
    language: (state: ExampleData, action: PayloadAction<ExampleData['language']>) => ({
      ...state,
      language: action.payload,
    }),
  },
});

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    exampleData: exampleDataSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const setApiCredentials = authSlice.actions.set;
export const clearApiCredentials = authSlice.actions.clear;
export const setCreateSignatureOrder = exampleDataSlice.actions.createSignatureOrder;
export const setCloseSignatureOrder = exampleDataSlice.actions.closeSignatureOrder;
export const setAddSignatory = exampleDataSlice.actions.addSignatory;
export const setLanguage = exampleDataSlice.actions.language;
export const clearExampleData = exampleDataSlice.actions.clear;
