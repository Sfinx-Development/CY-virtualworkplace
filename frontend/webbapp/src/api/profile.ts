import { Profile } from "../../types";

const apiUrl = `http://${window.location.hostname}:5290/profile`;

export const FetchGetTeamProfiles = async (
  teamId: string
): Promise<Profile[]> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
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

export const FetchMyProfile = async (teamId: string): Promise<Profile> => {
  try {
    const response = await fetch(apiUrl + "/byauth", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
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