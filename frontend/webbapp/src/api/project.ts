import { FileDTO, Project, ProjectUpdate, UpdateComment } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/project`;
const apiUpdateUrl = getApiUrl() + `/projectUpdate`;
const apiUpdateCommentUrl = getApiUrl() + `/updateComment`;
const apiFileUrl = getApiUrl() + `/projectFile`;

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

//////////////////////////UPDATE COMMENT

export const FetchCreateUpdateComment = async (
  comment: UpdateComment
): Promise<UpdateComment> => {
  try {
    const response = await fetch(apiUpdateCommentUrl + "/create", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av kommentar");
    }

    const responseBody = (await response.json()) as UpdateComment;

    const createdComment = {
      ...responseBody,
      dateCreated: new Date(responseBody.dateCreated),
    };
    return createdComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetCommentsByUpdate = async (
  projectUpdateId: string
): Promise<UpdateComment[]> => {
  try {
    const response = await fetch(apiUpdateCommentUrl + "/byprojectupdate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdateId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av kommentarerna");
    }

    const responseBody = await response.json();

    const comments = responseBody.$values.map((comment: UpdateComment) => ({
      ...comment,
      dateCreated: new Date(comment.dateCreated),
    })) as UpdateComment[];

    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

///////////////////////////////////UPDATECOMMMENT FILES
export const FetchCreateFile = async (formFile: FormData): Promise<FileDTO> => {
  try {
    const response = await fetch(apiFileUrl + "/create", {
      method: "POST",
      credentials: "include",
      body: formFile,
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av fil");
    }

    const responseBody = (await response.json()) as FileDTO;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetFilesByUpdateComment = async (
  updateCommentId: string
): Promise<FileDTO[]> => {
  try {
    const response = await fetch(apiFileUrl + "/byupdatecommentid", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateCommentId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av filerna");
    }

    const responseBody = await response.json();

    const files = responseBody.$values as FileDTO[];

    return files;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
