import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchForgotPassword } from "../api/auth";

interface AuthState {
  error: string | null;
  success: string | null;
}

export const initialState: AuthState = {
  success: null,
  error: null,
};

export const forgotPasswordAsync = createAsyncThunk<
  boolean,
  { email: string },
  { rejectValue: string }
>("user/forgotPassword", async ({ email }, thunkAPI) => {
  try {
    const isOk = await FetchForgotPassword(email);
    return isOk;
  } catch (error) {
    return thunkAPI.rejectWithValue("Utskick av nytt lösenord misslyckades.");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.success = "Nytt lösenord har skickats till din e-post.";
          state.error = null;
        }
      })
      .addCase(forgotPasswordAsync.rejected, (state) => {
        state.success = null;
        state.error = "Något gick fel vid utskick av nytt lösenord.";
      });
  },
});

export const authReducer = authSlice.reducer;
