import { Profile, ProfileHubDTO } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/profile";

export const FetchGetTeamProfiles = async (
  teamId: string
): Promise<Profile[]> => {
  try {
    const response = await fetch(`${apiUrl}/${teamId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av profiler");
    }
    //BEHÖVS DETTA?: varfööör
    const data = responseBody.$values as Profile[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchOnlineProfiles = async (
  teamId: string
): Promise<ProfileHubDTO[]> => {
  try {
    const response = await fetch(`${apiUrl}/online/${teamId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av online profiler");
    }
    //BEHÖVS DETTA?: varfööör
    const data = responseBody.$values as ProfileHubDTO[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchMyProfile = async (teamId: string): Promise<Profile> => {
  try {
    const response = await fetch(`${apiUrl}/byauth/${teamId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av min profil");
    }
    const data = responseBody as Profile;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchUpdateProfile = async (
  profile: Profile
): Promise<Profile> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid uppdateringen av profil");
    }
    const data = responseBody as Profile;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteProfile = async (profileId: string) => {
  try {
    const response = await fetch(`${apiUrl}/${profileId}`, {
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
