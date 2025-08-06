import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthSliceState {
    isLoggedIn: boolean;
    token: string
}

const initialState: AuthSliceState = {
    isLoggedIn: !!localStorage.getItem('accessToken'),
    token: localStorage.getItem('accessToken') || '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{token: string}>) => {
            localStorage.setItem('accessToken', action.payload.token);
            state.isLoggedIn = true;
            state.token = action.payload.token;
        },

        logOut: (state) => {
            localStorage.removeItem('accessToken');
            state.isLoggedIn = false,
            state.token = ''
        }
    }
})

export const {loginSuccess, logOut} = authSlice.actions;
export default authSlice.reducer;