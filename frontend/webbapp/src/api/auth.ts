const apiUrl = `http://${window.location.hostname}:5290/auth`;

export const FetchForgotPassword = async (email: string): Promise<string> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFuZ2VsaW5haG9sbXF2aXN0QGxpdmUuc2UiLCJVc2VySWQiOiJmNzNKQzUwcSIsIm5iZiI6MTcwNjI5NTk2NywiZXhwIjoxNzA3NTA1NTY3LCJpYXQiOjE3MDYyOTU5NjcsImlzcyI6IkNZLVZpcnR1YWxXb3JrcGxhY2UiLCJhdWQiOiJhcGkifQ.0-2s0_HFlQkLXVoT4_te4_OlmRJGBvHBzhPz9GO6hW0`, // lÄgger till JWT här SÅLÄNGE
      },
      body: JSON.stringify(email),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid mailutskick av nytt lösenord.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
