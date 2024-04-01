import { Todo } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/todo"; 


export const FetchEditTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid redigering av mötet");
    }
    const data = responseBody as Todo;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchDeleteTodo = async (

  todoId: string
): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todoId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid radering av todo");
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTodo = async (
  teamId: string
): Promise<Todo[]> => {
  try {
    const response = await fetch(apiUrl + "/getTodos", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av teamets healthchecks");
    }

    const responseBody = await response.json();
  
    const todos = responseBody.$values as Todo[];
    return todos;

  } catch (error) {
    console.error(error);
    throw error;
  }
};


// export const FetchGetTodo = async (
//   teamId:string
//   ): Promise<Todo[]> => {
//   try {
//     console.log("teamid", teamId)
//     const response = await fetch(apiUrl + "/getTodos",{
      
//       method: "POST",
//       credentials: "include",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       //  body: JSON.stringify({teamId}), 
//     });
//     const responseBody = await response.json();

//     if (!response.ok) {
//       throw new Error("Något gick fel vid hämtning av teams");
//     }
//     // const data = responseBody.$values as Todo[];
//     return responseBody as Todo[];
//     // return data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };


export const FetchCreateTeamTodo = async (
  newTodo: Todo
): Promise<Todo> => {
  try {
    const response = await fetch(apiUrl + "/create", {
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
