import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";
import { FetchSignIn } from "../api/logIn";
import { FetchGetUseer } from "../api/user";

interface UserState {
  user: User | undefined;
  error: string | null;
}

export const initialState: UserState = {
  user: undefined,
  error: null,
};

// export const addUserAsync = createAsyncThunk<
//   User,
//   UserCreate,
//   { rejectValue: string }
// >("user/addUser", async (user, thunkAPI) => {
//   try {
//     const addedUser = await addUserToDB(user);
//     if (addedUser) {
//       return addedUser;
//     } else {
//       return thunkAPI.rejectWithValue("failed to add user");
//     }
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error.message);
//   }
// });

export const logInUserAsync = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/logInUser", async ({ email, password }, thunkAPI) => {
  try {
    const response = await FetchSignIn(email, password);
    if (response.jwt) {
      const user = await FetchGetUseer(response.jwt);
      return user;
    } else {
      return thunkAPI.rejectWithValue(
        "Inloggningen misslyckades. Felaktiga uppgifter."
      );
    }
  } catch (error) {
    console.error(error);
    throw new Error("Ett fel uppstod vid inloggningen.");
  }
});

// export const deleteUserAsync = createAsyncThunk<
//   boolean,
//   UserCreate,
//   { rejectValue: string }
// >("user/deleteUser", async (user, thunkAPI) => {
//   try {
//     const response = await deleteUserFromDb(user);
//     return response;
//   } catch (error) {
//     throw new Error("Användarnamn eller lösenord var felaktigt.");
//   }
// });

// export const handleForgotPasswordAsync = createAsyncThunk<
//   boolean,
//   string,
//   { rejectValue: string }
// >("user/forgotPassword", async (email, thunkAPI) => {
//   try {
//     const emailSent = await handleForgotPasswordFirestore(email);
//     if (emailSent) {
//       return true;
//     } else {
//       return thunkAPI.rejectWithValue("Try resetting password later.");
//     }
//   } catch (error: any) {
//     return thunkAPI.rejectWithValue(error);
//   }
// });

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logOutUser: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(logInUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Användarnamn eller lösenord är felaktigt.";
      });
  },
});

export const userReducer = userSlice.reducer;
export const { logOutUser } = userSlice.actions;
