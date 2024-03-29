import { Project } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/project`;

export const FetchCreateProject = async (
  project: Project
): Promise<Project> => {
  try {
    const response = await fetch(apiUrl + "/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av project");
    }

    const responseBody = (await response.json()) as Project;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTeamProjects = async (
  teamId: string
): Promise<Project[]> => {
  try {
    const response = await fetch(apiUrl + "/byteam", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teamets projekt");
    }

    const responseBody = await response.json();

    const projects = responseBody.$values as Project[];
    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const FetchCreateProfileHealthCheck = async (
//   profileHealthcheck: ProfileHealthCheck
// ): Promise<ProfileHealthCheck> => {
//   try {
//     const response = await fetch(profileHealthCheckUrl + "/create", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(profileHealthcheck),
//     });

//     if (!response.ok) {
//       throw new Error("Något gick fel vid skapandet av profile health check");
//     }

//     const responseBody = (await response.json()) as ProfileHealthCheck;

//     return responseBody;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// export const FetchGetProfileHealthChecks = async (
//   healthCheckId: string
// ): Promise<ProfileHealthCheck[]> => {
//   try {
//     const response = await fetch(profileHealthCheckUrl + "/byhealthcheck", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(healthCheckId),
//     });

//     if (!response.ok) {
//       throw new Error("Något gick fel vid hämtandet av profile health checks");
//     }
//     const responseBody = await response.json();
//     const profileHealthchecks = responseBody.$values as ProfileHealthCheck[];

//     return profileHealthchecks;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// export const FetchGetProfileHealthChecksByProfile = async (
//   profileId: string
// ): Promise<ProfileHealthCheck[]> => {
//   try {
//     const response = await fetch(profileHealthCheckUrl + "/byprofile", {
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(profileId),
//     });

//     if (!response.ok) {
//       throw new Error("Något gick fel vid hämtandet av profile health checks");
//     }
//     const responseBody = await response.json();
//     const profileHealthchecks = responseBody.$values as ProfileHealthCheck[];

//     return profileHealthchecks;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
