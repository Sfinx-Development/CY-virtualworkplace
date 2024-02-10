// [Authorize]
// [HttpPost("teamconversation")]
// public async Task<ActionResult<Conversation>> AddProfileToConversation(
//     [FromBody] string teamId
// )

import {
  Conversation,
  ConversationParticipant,
  GetParticipantDTO,
  Message,
  MessageInput,
} from "../../types";

const conversationApiUrl = `http://${window.location.hostname}:5290/conversation`;
const messageApiUrl = `http://${window.location.hostname}:5290/message`;

export const FetchGetTeamMessages = async (
  teamId: string
): Promise<Message[]> => {
  try {
    const response = await fetch(conversationApiUrl + "/teammessages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av team conversation");
    }

    const responseBody = await response.json();
    console.log("REPONSE: ", responseBody);

    const messages = responseBody.$values;
    // console.log("Parsed conversation:", messagesData);

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
    const response = await fetch(conversationApiUrl + "/teamconversation", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av team conversation");
    }

    const responseBody = await response.json();
    console.log("REPONSE: ", responseBody);
    const conversation = responseBody as Conversation;

    return conversation;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const FetchCreateMessage = async (
  message: MessageInput
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
    console.log("RESPONSE från create message: ", responseBody);

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

export const FetchGetConversationParticipant = async (
  conversationId: string,
  profileId: string
): Promise<ConversationParticipant> => {
  try {
    const DTO: GetParticipantDTO = {
      profileId: profileId,
      conversationId: conversationId,
    };

    console.log("DTO: ", DTO);
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
    console.log("REPONSE: ", responseBody);

    const participant = responseBody as ConversationParticipant;

    return participant;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// [Authorize]
// [HttpPost("conversationparticipant")]
// public async Task<ActionResult<ConversationParticipant>> GetConversationParticipant(
//     [FromBody]  string conversationId,string profileId
// )
