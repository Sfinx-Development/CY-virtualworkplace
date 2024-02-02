import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "../../types";
import { FetchSignIn } from "../api/logIn";
import { FetchCreateUseer, FetchGetUseer } from "../api/user";

interface UserState {
  user: User | undefined;
  error: string | null;
}

export const initialState: UserState = {
  user: undefined,
  error: null,
};

export const createUserAsync = createAsyncThunk<
  User,
  User,
  { rejectValue: string }
>("user/addUser", async (user, thunkAPI) => {
  try {
    const createdUser = await FetchCreateUseer(user);
    if (createdUser) {
      console.log("created user: ", createdUser);
      return createdUser;
    } else {
      return thunkAPI.rejectWithValue("failed to add user");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
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
    throw new Error("Ett fel uppstod vid inloggningen.");
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
          state.error = null;
        }
      })
      .addCase(createUserAsync.rejected, (state) => {
        state.user = undefined;
        state.error = "Något gick fel med skapandet av konto.";
      });
  },
});

export const userReducer = userSlice.reducer;
export const { logOutUser } = userSlice.actions;
