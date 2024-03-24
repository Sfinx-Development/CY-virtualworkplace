import { Todo } from "../../types";
import { getApiUrl } from "./config";

// const apiUrl = getApiUrl() + "/todo";
const todoapiUrl = getApiUrl() + `/todo`;

export const FetchGetTodo = async (): Promise<Todo> => {
  try {
    const response = await fetch(todoapiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av user");
    }

    const data = await response.json();

    return data as Todo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateTeamTodo = async (
  newTodo: Todo
): Promise<Todo> => {
  try {
    const response = await fetch(todoapiUrl + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newTodo),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av todo.");
    }

    const data = await response.json();

    return data as Todo;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// export const FetchCreateTodo = async (newTodo: Todo): Promise<Todo> => {
//   try {
//     const response = await fetch(apiUrl + "/Create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(newTodo),
//     });

//     if (!response.ok) {
//       throw new Error("Något gick fel vid skapande av todo.");
//     }

//     const data = await response.json();

//     return data as Todo;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
