const apiUrl = `http://${window.location.hostname}:5290/login`;

export const FetchSignIn = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid inloggningen");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchLogOut = async () => {
  try {
    const response = await fetch(apiUrl + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid utloggning av användare.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
