import {
  Conversation,
  ConversationParticipant,
  GetParticipantDTO,
  Message,
} from "../../types";
import { getApiUrl } from "./config";

const conversationApiUrl = getApiUrl() + `/conversation`;

export const FetchGetTeamMessages = async (
  teamId: string
): Promise<Message[]> => {
  try {
    const response = await fetch(
      `${conversationApiUrl}/teammessages/${teamId}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av team conversation");
    }

    const responseBody = await response.json();

    const messages = responseBody.$values as Message[];
    return messages;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetTeamConversation = async (
  teamId: string
): Promise<Conversation> => {
  try {
    const response = await fetch(`${conversationApiUrl}/${teamId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av team conversation");
    }

    const responseBody = await response.json();

    const conversation = responseBody as Conversation;

    return conversation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchGetConversationParticipant = async (
  conversationId: string,
  profileId: string
): Promise<ConversationParticipant> => {
  try {
    const DTO: GetParticipantDTO = {
      profileId: profileId,
      conversationId: conversationId,
    };

    const response = await fetch(
      conversationApiUrl + "/conversationparticipant",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(DTO),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Något gick fel vid hämtning av deltagare i konversationen"
      );
    }

    const responseBody = await response.json();

    const participant = responseBody as ConversationParticipant;

    return participant;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
