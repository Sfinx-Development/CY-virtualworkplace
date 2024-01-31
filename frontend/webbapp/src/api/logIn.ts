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
    console.log(response);

    if (!response.ok) {
      throw new Error("Något gick fel vid inloggningen");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
