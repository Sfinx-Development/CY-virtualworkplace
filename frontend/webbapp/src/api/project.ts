import { Project, ProjectUpdate } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/project`;
const apiUpdateUrl = getApiUrl() + `/projectUpdate`;

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

    const updatedProject = {
      ...responseBody,
      dateCreated: new Date(responseBody.dateCreated),
      endDate: new Date(responseBody.endDate),
    };
    return updatedProject;
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

    const projects = responseBody.$values.map((project: Project) => ({
      ...project,
      dateCreated: new Date(project.dateCreated),
    })) as Project[];

    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////////////PROJECTUPDATE
export const FetchCreateProjectuPDATE = async (
  projectUpdate: ProjectUpdate
): Promise<ProjectUpdate> => {
  try {
    const response = await fetch(apiUpdateUrl + "/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdate),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av projekt uppdateringen");
    }

    const responseBody = (await response.json()) as ProjectUpdate;

    const updatedProjectUpdate = {
      ...responseBody,
      dateCreated: new Date(responseBody.dateCreated),
    };

    return updatedProjectUpdate;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetProjectUpdates = async (
  projectId: string
): Promise<ProjectUpdate[]> => {
  try {
    const response = await fetch(apiUpdateUrl + "/byproject", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectId),
    });

    if (!response.ok) {
      throw new Error(
        "Något gick fel vid hämtning av teamets projektuppdateringar"
      );
    }

    const responseBody = await response.json();

    const updates = responseBody.$values.map((update: ProjectUpdate) => ({
      ...update,
      dateCreated: new Date(update.dateCreated),
    })) as ProjectUpdate[];

    return updates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
