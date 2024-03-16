import * as signalR from "@microsoft/signalr";
import { Message } from "../../../types";

// Define your hub URL
const hubUrl = `http://${window.location.hostname}:5290/chathub`;

class ChatConnector {
  private connection: signalR.HubConnection;
  public events: {
    messageSent: (message: Message) => void;
    messageEdited: (message: Message) => void;
    messageDeleted: (messageId: string) => void;
  };
  static instance: ChatConnector;

  private constructor() {
    this.events = {
      messageSent: () => {},
      messageEdited: () => {},
      messageDeleted: () => {},
    };

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    this.connection.on("messageSent", (message: Message) => {
      this.events.messageSent(message);
    });
    this.connection.on("messageEdited", (message: Message) => {
      this.events.messageEdited(message);
    });
    this.connection.on("messageDeleted", (messageId: string) => {
      this.events.messageDeleted(messageId);
    });

    this.connection.start().catch((err) => {
      console.error("SignalR connection error:", err);
    });
  }

  public static getInstance(): ChatConnector {
    if (!ChatConnector.instance) ChatConnector.instance = new ChatConnector();
    return ChatConnector.instance;
  }

  public async invokeHubMethod<T>(
    methodName: string,
    ...args: T[]
  ): Promise<void> {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
      }
      await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error("Error invoking hub method:", error);
      throw error;
    }
  }

  public async start(): Promise<void> {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        await this.connection.start();
      }
    } catch (error) {
      console.error("Error starting SignalR connection:", error);
      throw error;
    }
  }
  public getConnection(): signalR.HubConnection {
    return this.connection;
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.connection.state;
  }
}

export default ChatConnector;
