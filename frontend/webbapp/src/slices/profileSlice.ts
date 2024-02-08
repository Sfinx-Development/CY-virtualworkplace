import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Profile, ProfileHubDTO } from "../../types";
import {
  FetchGetTeamProfiles,
  FetchMyProfile,
  FetchOnlineProfiles,
  FetchUpdateProfile,
} from "../api/profile";

interface ProfileState {
  profiles: Profile[] | undefined;
  activeProfile: Profile | undefined;
  error: string | null;
  onlineProfiles: ProfileHubDTO[] | undefined;
}

const saveProfilesToLocalStorage = (profiles: Profile[]) => {
  localStorage.setItem("profiles", JSON.stringify(profiles));
};
const loadProfilesFromLocalStorage = (): Profile[] | undefined => {
  const storedProfiles = localStorage.getItem("profiles");
  return storedProfiles ? JSON.parse(storedProfiles) : undefined;
};
const saveActiveProfileToLocalStorage = (profile: Profile) => {
  localStorage.setItem("activeProfile", JSON.stringify(profile));
};
const loadActiveProfileFromLocalStorage = (): Profile | undefined => {
  const storedActiveProfile = localStorage.getItem("activeProfile");
  return storedActiveProfile ? JSON.parse(storedActiveProfile) : undefined;
};

export const initialState: ProfileState = {
  profiles: loadProfilesFromLocalStorage(),
  activeProfile: loadActiveProfileFromLocalStorage(),
  error: null,
  onlineProfiles: [],
};

export const GetTeamProfiles = createAsyncThunk<
  Profile[],
  string,
  { rejectValue: string }
>("profile/getTeamProfiles", async (teamId, thunkAPI) => {
  try {
    const teamProfiles = await FetchGetTeamProfiles(teamId);
    if (teamProfiles) {
      saveProfilesToLocalStorage(teamProfiles);
      return teamProfiles;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av profiler."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av profiler."
    );
  }
});

export const GetOnlineProfiles = createAsyncThunk<
  ProfileHubDTO[],
  string,
  { rejectValue: string }
>("profile/getOnlineProfiles", async (teamId, thunkAPI) => {
  try {
    const onlineProfiles = await FetchOnlineProfiles(teamId);
    if (onlineProfiles) {
      console.log("ONLINEEEEEEEEEEEEEEEE:: ", onlineProfiles);
      return onlineProfiles;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av online profiler."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av online profiler."
    );
  }
});

export const GetMyProfileAsync = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("profile/getMyProfile", async (teamId, thunkAPI) => {
  try {
    const myProfile = await FetchMyProfile(teamId);
    if (myProfile) {
      saveActiveProfileToLocalStorage(myProfile);
      return myProfile;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av profiler."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av profiler."
    );
  }
});

export const UpdateProfileAsync = createAsyncThunk<
  Profile,
  Profile,
  { rejectValue: string }
>("profile/updateProfile", async (profile, thunkAPI) => {
  try {
    const myProfile = await FetchUpdateProfile(profile);
    if (myProfile) {
      saveActiveProfileToLocalStorage(myProfile);
      return myProfile;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av profiler."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av profiler."
    );
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    // setActiveProfile: (state, action) => {
    //   const profileId = action.payload;
    //   const activeProfile = state.profiles?.find(
    //     (profile: Profile) => profile.id === profileId
    //   );
    //   if (activeProfile) {
    //     state.activeProfile = activeProfile;
    //     saveActiveProfileToLocalStorage(activeProfile);
    //   }
    // },
    getActiveProfile: (state) => {
      const activeProfile = loadActiveProfileFromLocalStorage();
      if (activeProfile) {
        state.activeProfile = activeProfile;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetTeamProfiles.fulfilled, (state, action) => {
        if (action.payload) {
          state.profiles = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamProfiles.rejected, (state) => {
        state.profiles = undefined;
        state.error = "Något gick fel med hämtandet av online profiler.";
      })
      .addCase(GetOnlineProfiles.fulfilled, (state, action) => {
        if (action.payload) {
          state.onlineProfiles = action.payload;
          state.error = null;
        }
      })
      .addCase(GetOnlineProfiles.rejected, (state) => {
        state.onlineProfiles = undefined;
        state.error = "Något gick fel med hämtandet av online profiler.";
      })
      .addCase(GetMyProfileAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProfile = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyProfileAsync.rejected, (state) => {
        state.activeProfile = undefined;
        state.error = "Något gick fel med hämtandet av aktiv profil.";
      })
      .addCase(UpdateProfileAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProfile = action.payload;
          state.error = null;
        }
      })
      .addCase(UpdateProfileAsync.rejected, (state) => {
        state.activeProfile = undefined;
        state.error = "Något gick fel med hämtandet av aktiv profil.";
      });
  },
});

export const { getActiveProfile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
