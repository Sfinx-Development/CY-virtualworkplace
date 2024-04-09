import { User, UserCreate } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/user";

export const FetchGetUseer = async (): Promise<User> => {
  try {
    const response = await fetch(apiUrl, {
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

    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateUseer = async (newUser: UserCreate): Promise<User> => {
  try {
    const response = await fetch(apiUrl + "/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid skapandet av användare.");
    }

    const data = await response.json();
    console.log("SKAÅAD: ", data);
    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
