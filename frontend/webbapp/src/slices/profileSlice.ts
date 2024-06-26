import * as signalR from "@microsoft/signalr";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OwnerRequest, Profile, ProfileHubDTO } from "../../types";
import {
  FetchCreateOwnerRequest,
  FetchGetMyOwnerRequest,
  FetchUpdateOwnerRequest,
} from "../api/ownerrequest";
import {
  FetchDeleteProfile,
  FetchGetTeamProfiles,
  FetchMyProfile,
  FetchOnlineProfiles,
  FetchUpdateProfile,
} from "../api/profile";
import Connector from "../pages/AfterChosenTeam/OnlineConnection";

export interface ProfileState {
  profiles: Profile[] | undefined;
  activeProfile: Profile | undefined;
  error: string | null;
  onlineProfiles: ProfileHubDTO[];
  allOwnerRequests: OwnerRequest[] | undefined;
  myOwnerRequest: OwnerRequest | undefined;
}

const saveProfilesToLocalStorage = (profiles: Profile[]) => {
  localStorage.setItem("profiles", JSON.stringify(profiles));
};
const loadProfilesFromLocalStorage = (): Profile[] | undefined => {
  const storedProfiles = localStorage.getItem("profiles");
  return storedProfiles ? JSON.parse(storedProfiles) : undefined;
};
const saveActiveProfileToLocalStorage = (profile: Profile | undefined) => {
  localStorage.setItem("activeProfile", JSON.stringify(profile));
};
const loadActiveProfileFromLocalStorage = (): Profile | undefined => {
  const storedActiveProfile = localStorage.getItem("activeProfile");
  try {
    return storedActiveProfile ? JSON.parse(storedActiveProfile) : undefined;
  } catch (error) {
    console.error("Error parsing active profile from localStorage:", error);
    return undefined;
  }
};

export const initialState: ProfileState = {
  profiles: loadProfilesFromLocalStorage(),
  activeProfile: loadActiveProfileFromLocalStorage(),
  error: null,
  onlineProfiles: [],
  allOwnerRequests: [],
  myOwnerRequest: undefined,
};

export const GetMyOwnerRequestAsync = createAsyncThunk<
  OwnerRequest,
  string,
  { rejectValue: string }
>("profile/getmyownerrequest", async (profileId, thunkAPI) => {
  try {
    const myOwnerRequests = await FetchGetMyOwnerRequest(profileId);
    if (myOwnerRequests) {
      return myOwnerRequests;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtning av förfrågningar."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtning av förfrågningar."
    );
  }
});

export const UpdateOwnerRequestAsync = createAsyncThunk<
  OwnerRequest,
  OwnerRequest,
  { rejectValue: string }
>("profile/updateownerrequest", async (ownerRequest, thunkAPI) => {
  try {
    const updatedRequest = await FetchUpdateOwnerRequest(ownerRequest);
    if (updatedRequest) {
      return updatedRequest;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid uppdatering av ägareförfrågan."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid uppdatering av ägareförfrågan."
    );
  }
});

export const createOwnerRequest = createAsyncThunk<
  OwnerRequest,
  OwnerRequest,
  { rejectValue: string }
>("profile/createownerrequest", async (ownerRequest, thunkAPI) => {
  try {
    const request = await FetchCreateOwnerRequest(ownerRequest);
    if (request) {
      return request;
    } else {
      return thunkAPI.rejectWithValue("failed to create owner request");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue("Något gick fel.");
  }
});

export const enterMeetingRoomAsync = createAsyncThunk(
  "profile/enterMeetingRoom",
  async (profileId: string) => {
    const connection = Connector.getInstance();
    try {
      if (
        connection.getConnectionState() !== signalR.HubConnectionState.Connected
      ) {
        await connection.start();
      }
      if (
        connection.getConnectionState() === signalR.HubConnectionState.Connected
      ) {
        await connection.invokeHubMethod<string>(
          "ProfileEnterMeetingRoom",
          profileId
        );
      } else {
        console.error("SignalR connection is not in the 'Connected' state.");
      }
    } catch (error) {
      console.error("Error sending enter meeting room request:", error);
    }
  }
);

export const leaveMeetingRoomAsync = createAsyncThunk(
  "profile/leaveMeetingRoom",
  async (profileId: string) => {
    const connection = Connector.getInstance();
    try {
      if (
        connection.getConnectionState() ===
        signalR.HubConnectionState.Disconnected
      ) {
        await connection.start();
      }
      connection.invokeHubMethod<string>(
        "ProfileLeavingMeetingRoom",
        profileId
      );
    } catch (error) {
      console.error("Error invoking hub method:", error);
    }
  }
);

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

//för att lämna ett team
export const DeleterofileAsync = createAsyncThunk<
  Profile,
  Profile,
  { rejectValue: string }
>("profile/deleteProfile", async (profile, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteProfile(profile.id);
    if (isDeleted) {
      return profile;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid radering av profil."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid radering av profil."
    );
  }
});

export const profileOnline = createAsyncThunk(
  "profile/profileOnline",
  (profile: ProfileHubDTO) => {
    return profile;
  }
);

export const profileOffline = createAsyncThunk(
  "profile/profileOffline",
  (profileId: string) => {
    return profileId;
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetActiveProile: (state) => {
      state.activeProfile = undefined;
      saveActiveProfileToLocalStorage(undefined);
    },
    setActiveProfile: (state, action) => {
      const profileId = action.payload;
      const activeProfile = state.profiles?.find(
        (profile: Profile) => profile.id === profileId
      );
      if (activeProfile) {
        state.activeProfile = activeProfile;
        saveActiveProfileToLocalStorage(activeProfile);
      } else {
        saveActiveProfileToLocalStorage(undefined);
      }
    },
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
          const onlineProfilesWithoutActiveProfile = action.payload.filter(
            (profile) => profile.profileId !== state.activeProfile?.id
          );
          state.onlineProfiles = onlineProfilesWithoutActiveProfile;
          state.error = null;
        }
      })
      .addCase(GetOnlineProfiles.rejected, (state) => {
        state.onlineProfiles = [];
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
      })
      .addCase(DeleterofileAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeProfile = undefined;
          state.error = null;
        }
      })
      .addCase(DeleterofileAsync.rejected, (state) => {
        state.error = "Något gick fel med radering av profil.";
      })
      .addCase(profileOnline.fulfilled, (state, action) => {
        if (action.payload && state.activeProfile) {
          if (action.payload.teamId == state.activeProfile.teamId) {
            state.onlineProfiles = [...state.onlineProfiles, action.payload];
          }
        }
      })
      .addCase(profileOffline.fulfilled, (state, action) => {
        if (action.payload && state.onlineProfiles) {
          state.onlineProfiles = state.onlineProfiles.filter(
            (profile) => profile.profileId !== action.payload
          );
        }
      })
      .addCase(GetMyOwnerRequestAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.myOwnerRequest = action.payload;
          state.error = null;
        }
      })
      .addCase(GetMyOwnerRequestAsync.rejected, (state) => {
        state.myOwnerRequest = undefined;
      })
      .addCase(UpdateOwnerRequestAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.myOwnerRequest = undefined;
          state.error = null;
        }
      })
      .addCase(UpdateOwnerRequestAsync.rejected, (state) => {
        state.myOwnerRequest = undefined;
      });
  },
});

export const { getActiveProfile, resetActiveProile } = profileSlice.actions;
export const profileReducer = profileSlice.reducer;
