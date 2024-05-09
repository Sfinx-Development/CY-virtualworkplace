import { OwnerRequest } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/ownerrequest";

export const FetchGetMyOwnerRequest = async (
  profileId: string
): Promise<OwnerRequest> => {
  try {
    const response = await fetch(`${apiUrl}/byprofile/${profileId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av ownerrequests");
    }

    const data = responseBody as OwnerRequest;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetRequestsByTeamId = async (
  teamId: string
): Promise<OwnerRequest[]> => {
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
      throw new Error("Något gick fel vid hämtning av ownerrequests");
    }

    const data = responseBody.$values as OwnerRequest[];
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateOwnerRequest = async (
  ownerRequest: OwnerRequest
): Promise<OwnerRequest> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(ownerRequest),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av ägare-förfrågan.");
    }

    const data = await response.json();

    return data as OwnerRequest;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchUpdateOwnerRequest = async (
  ownerRequest: OwnerRequest
): Promise<OwnerRequest> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(ownerRequest),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid att uppdatera ownerrequest.");
    }

    const data = await response.json();

    return data as OwnerRequest;
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
