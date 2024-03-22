import { HealthCheck, ProfileHealthCheck } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/healthcheck`;
const profileHealthCheckUrl = getApiUrl() + `/profileHealthCheck`;

export const FetchCreateHealthCheck = async (
  healthcheck: HealthCheck
): Promise<HealthCheck> => {
  try {
    const response = await fetch(apiUrl + "/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(healthcheck),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av healthcheck");
    }

    const responseBody = (await response.json()) as HealthCheck;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTeamHealthChecks = async (
  profileId: string
): Promise<HealthCheck[]> => {
  try {
    const response = await fetch(apiUrl + "/byteam", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teamets healthchecks");
    }

    const responseBody = await response.json();

    const healthchecks = responseBody.$values as HealthCheck[];
    return healthchecks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateProfileHealthCheck = async (
  profileHealthcheck: ProfileHealthCheck
): Promise<ProfileHealthCheck> => {
  try {
    const response = await fetch(profileHealthCheckUrl + "/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileHealthcheck),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av profile health check");
    }

    const responseBody = (await response.json()) as ProfileHealthCheck;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
