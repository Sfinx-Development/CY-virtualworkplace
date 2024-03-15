const apiUrl = "https://cyapi.azurewebsites.net/login";

// if (process.env.NODE_ENV === "development") {
//   // Om utvecklingsläge, använd IP-adressen för din lokal utvecklingsmiljö
//   apiUrl = `http://${window.location.hostname}:5290/login`; // Ändra portnummeret till det som din backend använder lokalt
// } else {
//   // Annars, använd produktions-URL:en
//   apiUrl = `https://cyapi.azurewebsites.net/login`;
// }
export const FetchSignIn = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    console.log(process.env.NODE_ENV);
    console.log("apiurl: ", apiUrl);
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
    } else if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
