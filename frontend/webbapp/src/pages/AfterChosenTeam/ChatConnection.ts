import * as signalR from "@microsoft/signalr";
import { Message } from "../../../types";

// Define your hub URL
const hubUrl = `http://${window.location.hostname}:5290/chathub`;

class ChatConnector {
  private connection: signalR.HubConnection;
  public events: {
    messageSent: (message: Message) => void;
  };
  static instance: ChatConnector;

  private constructor() {
    this.events = {
      messageSent: () => {},
    };

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    this.connection.on("messageSent", (message: Message) => {
      this.events.messageSent(message);
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
        console.log("SignalR connection started.");
      } else {
        console.log(
          "SignalR connection is already started or in the process of reconnecting."
        );
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
