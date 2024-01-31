const apiUrl = `http://${window.location.hostname}:5290/auth`;

export const FetchForgotPassword = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
    });
    console.log("response: ", response);

    if (!response.ok) {
      throw new Error("Något gick fel vid mailutskick av nytt lösenord.");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
