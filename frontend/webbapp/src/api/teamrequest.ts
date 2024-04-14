import { CreateTeamDTO, Team, TeamRequest } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/teamrequest";

export const FetchGetMyTeamRequests = async (): Promise<TeamRequest[]> => {
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
      throw new Error("Något gick fel vid hämtning av teamrequests");
    }

    const data = responseBody.$values as TeamRequest[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetRequestsByTeamId = async (
  teamId: string
): Promise<TeamRequest[]> => {
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
      throw new Error("Något gick fel vid hämtning av teamrequests");
    }

    const data = responseBody.$values as TeamRequest[];
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
    const response = await fetch(apiUrl, {
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

export const FetchUpdateTeamRequest = async (
  teamRequest: TeamRequest
): Promise<TeamRequest> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(teamRequest),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid att uppdatera teamrequest.");
    }

    const data = await response.json();

    return data as TeamRequest;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteRequest = async (requestId: string) => {
  try {
    const response = await fetch(`${apiUrl}/${requestId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid att readera förfrågan.");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
