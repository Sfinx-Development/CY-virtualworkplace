import { User, UserCreate } from "../../types";
import { getApiUrl } from "./config";

const apiUrl = getApiUrl() + "/user";

export const FetchGetUseer = async (): Promise<User> => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av användare");
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
    const response = await fetch(apiUrl, {
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
    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchUpdateUser = async (user: User): Promise<User> => {
  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid uppdatering av användare.");
    }

    const data = await response.json();
    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
