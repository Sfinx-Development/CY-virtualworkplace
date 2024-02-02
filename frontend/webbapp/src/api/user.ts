import { User } from "../../types";

const apiUrl = `http://${window.location.hostname}:5290/user`;

export const FetchGetUseer = async (): Promise<User> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("RESPONSE från get user: ", response);

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


