import { Message, MessageOutgoing } from "../../types";

const messageApiUrl = "https://cyapi.azurewebsites.net/message";

export const FetchDeleteMessage = async (
  messageId: string
): Promise<boolean> => {
  try {
    const response = await fetch(messageApiUrl, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid radering av meddelande");
    } else {
      return true;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateMessage = async (
  message: MessageOutgoing
): Promise<Message> => {
  try {
    const response = await fetch(messageApiUrl + "/send", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid skapande av meddelande");
    }

    const data = responseBody as Message;

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchEditMessage = async (
  message: MessageOutgoing
): Promise<Message> => {
  try {
    const response = await fetch(messageApiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    const responseBody = await response.json();

    if (!response.ok) {
      throw new Error("Något gick fel vid redigering av meddelande");
    }
    const data = responseBody as Message;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
