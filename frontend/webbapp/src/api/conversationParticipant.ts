import { ConversationParticipant } from "../../types";

const conversationParticipantApiUrl = `https://cyapi.azurewebsites.net/conversationParticipant`;

export const FetchUpdateLastActive = async (
  conversationParticipant: ConversationParticipant
): Promise<ConversationParticipant> => {
  try {
    const response = await fetch(conversationParticipantApiUrl, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(conversationParticipant),
    });

    if (!response.ok) {
      throw new Error("Något gick fel med uppdatering av senast aktiv.");
    }

    const responseBody = (await response.json()) as ConversationParticipant;
    return responseBody;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
