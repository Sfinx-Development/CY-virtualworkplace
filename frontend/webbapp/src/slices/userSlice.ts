import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User, UserCreate } from "../../types";
import { FetchLogOut, FetchSignIn } from "../api/logIn";
import { FetchCreateUseer, FetchGetUseer, FetchUpdateUser } from "../api/user";

export interface UserState {
  user: User | undefined;
  error: string | null;
  logInError: string | null;
  createAccountError: string | null;
}

export const initialState: UserState = {
  user: undefined,
  error: null,
  logInError: null,
  createAccountError: null,
};

export const createUserAsync = createAsyncThunk<
  User,
  UserCreate,
  { rejectValue: string }
>("user/addUser", async (user, thunkAPI) => {
  try {
    const createdUser = await FetchCreateUseer(user);
    if (createdUser) {
      return createdUser;
    } else {
      return thunkAPI.rejectWithValue("Något gick fel");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Det verkar som att denna email redan finns registrerad."
    );
  }
});

export const updateUserAsync = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("user/updateUser", async (user, thunkAPI) => {
  try {
    const updatedUser = await FetchUpdateUser(user);
    if (updatedUser) {
      return updatedUser;
    } else {
      return thunkAPI.rejectWithValue("Något gick fel");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Något fick fel vid uppdateringen av användare."
    );
  }
});

export const logOutUserAsync = createAsyncThunk("user/logOutUser", async () => {
  try {
    const isLoggedOut = await FetchLogOut();

    return isLoggedOut;
  } catch (error) {
    console.error(error);
  }
});

export const logInUserAsync = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("user/logInUser", async ({ email, password }, thunkAPI) => {
  try {
    const isAuthenticated = await FetchSignIn(email, password);
    if (isAuthenticated) {
      const user = await FetchGetUseer();
      if (user) {
        return user;
      }
      return thunkAPI.rejectWithValue(
        "Inloggningen misslyckades. Felaktiga uppgifter."
      );
    } else {
      return thunkAPI.rejectWithValue(
        "Inloggningen misslyckades. Felaktiga uppgifter."
      );
    }
  } catch (error) {
    console.error(error);
    return thunkAPI.rejectWithValue(
      "Inloggningen misslyckades. Felaktiga uppgifter."
    );
  }
});

export const getUserAsync = createAsyncThunk<User>("user/getUser", async () => {
  try {
    const user = await FetchGetUseer();
    return user;
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
    clearCreateAccountError: (state) => {
      state.createAccountError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.logInError = null;
        }
      })
      .addCase(logInUserAsync.rejected, (state) => {
        state.user = undefined;
        state.logInError = "Användarnamn eller lösenord är felaktigt.";
      })
      .addCase(logOutUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = undefined;
          state.error = null;
        }
      })
      .addCase(logOutUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Något gick fel vid utloggningen.";
      })
      .addCase(getUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(getUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Auth is not correct.";
      })
      .addCase(createUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.createAccountError = null;
        }
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.createAccountError =
          action.payload ?? "Ett oväntat fel inträffade.";
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.error = null;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload ?? "Ett oväntat fel inträffade.";
      });
  },
});

export const { clearCreateAccountError } = userSlice.actions;
export const userReducer = userSlice.reducer;
