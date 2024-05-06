import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Survey, ProfileToSurvey } from "../../types";
import {
  FetchCreateSurvey,
  FetchCreateProfileSurvey,
  FetchDeleteSurvey,
  FetchGetProfileSurveys,
  FetchGetProfileSurveysByProfile,
  FetchGetTeamSurveys,
} from "../api/survey";

export interface SurveyState {
  surveys: Survey[] | undefined;
  activeSurvey: Survey | undefined;
  profileSurveys: ProfileToSurvey[] | undefined;
  activeProfileSurvey: ProfileToSurvey | undefined;
  error: string | null;
}

export const initialState: SurveyState = {
  surveys: undefined,
  activeSurvey: undefined,
  profileSurveys: undefined,
  activeProfileSurvey: undefined,
  error: null,
};

export const CreateSurveyAsync = createAsyncThunk<
  Survey,
  Survey,
  { rejectValue: string }
>("survey/createsurvey", async (survey, thunkAPI) => {
  try {
    const createdSurvey = await FetchCreateSurvey(survey);
    if (createdSurvey) {
      return createdSurvey;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av survey."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid skapande av survey."
    );
  }
});

export const DeleteSurveyAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("survey/deletesurvey", async (surveyId, thunkAPI) => {
  try {
    const isDeleted = await FetchDeleteSurvey(surveyId);
    if (isDeleted) {
      return surveyId;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid borttagning av survey."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid borttagning av survey."
    );
  }
});

export const GetTeamSurveysAsync = createAsyncThunk<
  Survey[],
  string,
  { rejectValue: string }
>("survey/getsurvey", async (profileId, thunkAPI) => {
  try {
    const surveys = await FetchGetTeamSurveys(profileId);
    if (surveys) {
      return surveys;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av surveys."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av surveys."
    );
  }
});

export const GetProfileSurveysAsync = createAsyncThunk<
  ProfileToSurvey[],
  string,
  { rejectValue: string }
>("survey/getprofilesurveys", async (surveyId, thunkAPI) => {
  try {
    const profileSurveys = await FetchGetProfileSurveys(surveyId);
    if (profileSurveys) {
      return profileSurveys;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av profilesurveys."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av profilesurveys."
    );
  }
});

export const GetProfileSurveysByProfileAsync = createAsyncThunk<
  ProfileToSurvey[],
  string,
  { rejectValue: string }
>("survey/getprofilesurveysbyprofile", async (profileId, thunkAPI) => {
  try {
    const profileSurveys = await FetchGetProfileSurveysByProfile(profileId);
    if (profileSurveys) {
      return profileSurveys;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid hämtande av profilesurveys."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid hämtande av profilesurveys."
    );
  }
});

export const CreateProfileSurveyAsync = createAsyncThunk<
  ProfileToSurvey,
  ProfileToSurvey,
  { rejectValue: string }
>("survey/createprofilesurvey", async (profileSurvey, thunkAPI) => {
  try {
    const createdProfileSurvey = await FetchCreateProfileSurvey(profileSurvey);
    if (createdProfileSurvey) {
      return createdProfileSurvey;
    } else {
      return thunkAPI.rejectWithValue(
        "Ett fel inträffade vid skapande av profile survey."
      );
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(
      "Ett fel inträffade vid skapande av profile survey."
    );
  }
});

const surveySlice = createSlice({
  name: "survey",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateSurveyAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.surveys?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateSurveyAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(GetTeamSurveysAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.surveys = action.payload;
          state.error = null;
        }
      })
      .addCase(GetTeamSurveysAsync.rejected, (state) => {
        state.surveys = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(GetProfileSurveysAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileSurveys = action.payload;
          state.error = null;
        }
      })
      .addCase(GetProfileSurveysAsync.rejected, (state) => {
        state.profileSurveys = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(GetProfileSurveysByProfileAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileSurveys = action.payload;
          state.error = null;
        }
      })
      .addCase(GetProfileSurveysByProfileAsync.rejected, (state) => {
        state.profileSurveys = undefined;
        state.error = "Något gick fel.";
      })
      .addCase(CreateProfileSurveyAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.profileSurveys?.push(action.payload);
          state.error = null;
        }
      })
      .addCase(CreateProfileSurveyAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      })
      .addCase(DeleteSurveyAsync.fulfilled, (state, action) => {
        if (action.payload && state.surveys) {
          state.surveys = state.surveys.filter((h) => h.id !== action.payload);
          state.error = null;
        }
      })
      .addCase(DeleteSurveyAsync.rejected, (state) => {
        state.error = "Något gick fel.";
      });
  },
});

export const surveyReducer = surveySlice.reducer;
