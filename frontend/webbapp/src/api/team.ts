import { CreateTeamDTO, Team } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/team";

export const FetchGetMyTeams = async (): Promise<Team[]> => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teams");
    }
    //VAFÖR BEHÖVA GÖRA SÅHÄR??
    const data = responseBody.$values as Team[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateTeam = async (
  newTeam: CreateTeamDTO
): Promise<Team> => {
  try {
    const response = await fetch(apiUrl + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newTeam),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av team.");
    }

    const data = await response.json();

    return data as Team;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchJoinTeam = async ({
  code,
  role,
}: {
  code: string;
  role: string;
}): Promise<Team> => {
  try {
    const response = await fetch(apiUrl + "/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ code, role }),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid gå med i team.");
    }

    const data = await response.json();

    return data as Team;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchUpdateTeam = async (team: Team): Promise<Team> => {
  try {
    console.log("TEAMET: ", team);
    const response = await fetch(apiUrl + "/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(team),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid att uppdatera team.");
    }

    const data = await response.json();

    return data as Team;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
