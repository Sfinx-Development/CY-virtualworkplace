import { User } from "../../types";

const apiUrl = `http://${window.location.hostname}:5290/user`;

export const FetchGetUseer = async (jwt: string): Promise<User> => {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`, // lÄgger till JWT här SÅLÄNGE
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av user");
    }

    const data = await response.json();

    // jag kan också hantera JWT-cookie från responsens headers om det behövs
    // const jwtCookie = response.headers.get("Set-Cookie");
    // hantera cookien här - spara jwtn?

    return data as User;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
