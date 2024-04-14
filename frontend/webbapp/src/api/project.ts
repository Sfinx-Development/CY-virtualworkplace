import {
  FileDTO,
  Project,
  ProjectNoDate,
  ProjectUpdate,
  ProjectUpdateNoDate,
  UpdateComment,
  UpdateCommentNoDate,
} from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + `/project`;
const apiUpdateUrl = getApiUrl() + `/projectUpdate`;
const apiUpdateCommentUrl = getApiUrl() + `/updateComment`;
const apiFileUrl = getApiUrl() + `/projectFile`;

export const FetchCreateProject = async (
  project: Project
): Promise<ProjectNoDate> => {
  try {
    const response = await fetch(apiUrl, {
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

    const responseBody = (await response.json()) as ProjectNoDate;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTeamProjects = async (
  teamId: string
): Promise<ProjectNoDate[]> => {
  try {
    const response = await fetch(`${apiUrl}/teamid/${teamId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teamets projekt");
    }

    const responseBody = await response.json();

    const projects = responseBody.$values as ProjectNoDate[];

    return projects;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchEditProject = async (
  project: Project
): Promise<ProjectNoDate> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid uppdatering av project");
    }

    const responseBody = (await response.json()) as ProjectNoDate;

    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteProject = async (projectId: string) => {
  try {
    const response = await fetch(`${apiUrl}/${projectId}`, {
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

/////////////////////////////////PROJECTUPDATE
export const FetchCreateProjectuPDATE = async (
  projectUpdate: ProjectUpdate
): Promise<ProjectUpdateNoDate> => {
  try {
    const response = await fetch(apiUpdateUrl, {
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

    const updatedProjectUpdate = (await response.json()) as ProjectUpdateNoDate;

    return updatedProjectUpdate;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetProjectUpdates = async (
  projectId: string
): Promise<ProjectUpdateNoDate[]> => {
  try {
    const response = await fetch(`${apiUpdateUrl}/byproject/${projectId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Något gick fel vid hämtning av teamets projektuppdateringar"
      );
    }

    const responseBody = await response.json();

    const updates = responseBody.$values as ProjectUpdateNoDate[];

    return updates;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteProjectUpdate = async (projectUpdateId: string) => {
  try {
    const response = await fetch(`${apiUpdateUrl}/${projectUpdateId}`, {
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

//////////////////////////UPDATE COMMENT

export const FetchCreateUpdateComment = async (
  comment: UpdateComment
): Promise<UpdateCommentNoDate> => {
  try {
    const response = await fetch(apiUpdateCommentUrl, {
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

    const createdComment = (await response.json()) as UpdateCommentNoDate;

    return createdComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetCommentsByUpdate = async (
  projectUpdateId: string
): Promise<UpdateCommentNoDate[]> => {
  try {
    const response = await fetch(
      `${apiUpdateCommentUrl}/byprojectupdate/${projectUpdateId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av kommentarerna");
    }

    const responseBody = await response.json();

    const comments = responseBody.$values as UpdateCommentNoDate[];
    return comments;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchEditUpdateComment = async (
  comment: UpdateComment
): Promise<UpdateCommentNoDate> => {
  try {
    const response = await fetch(apiUpdateCommentUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid redigering av kommentar");
    }

    const createdComment = (await response.json()) as UpdateCommentNoDate;

    return createdComment;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteUpdateComment = async (updateCommentId: string) => {
  try {
    const response = await fetch(`${apiUpdateCommentUrl}/${updateCommentId}`, {
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

///////////////////////////////////UPDATECOMMMENT FILES
export const FetchCreateFile = async (formFile: FormData): Promise<FileDTO> => {
  try {
    const response = await fetch(apiFileUrl, {
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
    const response = await fetch(
      `${apiFileUrl}/byupdatecommentid/${updateCommentId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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

export const FetchDeleteFile = async (fileId: string) => {
  try {
    const response = await fetch(`${apiFileUrl}/${fileId}`, {
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
