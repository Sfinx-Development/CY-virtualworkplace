import { User } from "../../types";

let apiUrl: string;

export const FetchGetUseer = async (): Promise<User> => {
  try {
    if (process.env.NODE_ENV === "development") {
      // Om utvecklingsläge, använd IP-adressen för din lokal utvecklingsmiljö
      apiUrl = `http://${window.location.hostname}:5290/user`; // Ändra portnummeret till det som din backend använder lokalt
    } else {
      // Annars, använd produktions-URL:en
      apiUrl = `https://cyapi.azurewebsites.net/user`;
    }
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

export const FetchCreateUseer = async (newUser: User): Promise<User> => {
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

    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
