export const getApiUrl = (): string => {
  if (process.env.NODE_ENV === "development") {
    return `http://${window.location.hostname}:5290`;
  } else {
    return "https://cyapi.azurewebsites.net";
  }
};
