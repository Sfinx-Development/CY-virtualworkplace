import { Survey, ProfileToSurvey } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/survey`;
const profileSurveyUrl = getApiUrl() + `/profileSurvey`;

export const FetchCreateSurvey = async (survey: Survey): Promise<Survey> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(survey),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av survey");
    }

    const responseBody = (await response.json()) as Survey;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteSurvey = async (surveyId: string) => {
  try {
    const response = await fetch(`${apiUrl}/${surveyId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTeamSurveys = async (
  profileId: string
): Promise<Survey[]> => {
  try {
    const response = await fetch(`${apiUrl}/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teamets surveys");
    }

    const responseBody = await response.json();

    const surveys = responseBody.$values as Survey[];
    return surveys;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateProfileSurvey = async (
  profileSurvey: ProfileToSurvey
): Promise<ProfileToSurvey> => {
  try {
    const response = await fetch(profileSurveyUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileSurvey),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av profile health check");
    }

    const responseBody = (await response.json()) as ProfileToSurvey;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetProfileSurveys = async (
  SurveyId: string
): Promise<ProfileToSurvey[]> => {
  try {
    const response = await fetch(`${profileSurveyUrl}/byid/${SurveyId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtandet av profile health checks");
    }
    const responseBody = await response.json();
    const profileSurveys = responseBody.$values as ProfileToSurvey[];

    return profileSurveys;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetProfileSurveysByProfile = async (
  profileId: string
): Promise<ProfileToSurvey[]> => {
  try {
    const response = await fetch(`${profileSurveyUrl}/byprofile/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtandet av profile health checks");
    }
    const responseBody = await response.json();
    const profileSurveys = responseBody.$values as ProfileToSurvey[];

    return profileSurveys;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
