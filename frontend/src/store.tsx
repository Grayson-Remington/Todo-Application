import { createSlice, configureStore } from '@reduxjs/toolkit';

export const jwtSlice = createSlice({
	name: 'jwt',
	initialState: {
		value: '',
	},
	reducers: {
		setJwt: (state, action) => {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes

			state.value = action.payload;
		},
		deleteJwt: (state) => {
			state.value = '';
		},
	},
});

export const { setJwt, deleteJwt } = jwtSlice.actions;

export const store = configureStore({
	reducer: {
		jwt: jwtSlice.reducer,
	},
});

// Can still subscribe to the store

// Still pass action objects to `dispatch`, but they're created for us

// {value: 1}

// {value: 2}

// {value: 1}
