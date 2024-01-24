import { LogInWithJwt } from "../../types";

const apiUrl = `http://${window.location.hostname}:5290/login`;

export const FetchSignIn = async (
  email: string,
  password: string
): Promise<LogInWithJwt> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid inloggningen");
    }

    const data = await response.json();

    // hantera cookien här - spara jwtn ?

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
