const apiUrl = `http://${window.location.hostname}:5290/auth`;

export const FetchForgotPassword = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6InNvbG9zaUBnbWFpbC5jb20iLCJVc2VySWQiOiI3dlpXMk9hcyIsIm5iZiI6MTcwNjM3MzQ5NiwiZXhwIjoxNzA3NTgzMDk2LCJpYXQiOjE3MDYzNzM0OTYsImlzcyI6IkNZLVZpcnR1YWxXb3JrcGxhY2UiLCJhdWQiOiJhcGkifQ.P4NBKzDq1pV4tIH5I3R4PwaxByJWvyEN7LRRDC9v8Qg`, // lÄgger till JWT här SÅLÄNGE
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
