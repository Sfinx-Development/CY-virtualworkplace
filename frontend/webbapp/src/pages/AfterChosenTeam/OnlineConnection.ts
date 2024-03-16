import * as signalR from "@microsoft/signalr";
import { ProfileHubDTO } from "../../../types";

// Define your hub URL
const hubUrl = `http://${window.location.hostname}:5290/meetingroomhub`;

class Connector {
  private connection: signalR.HubConnection;
  public events: {
    profileOnline: (profile: ProfileHubDTO) => void;
    profileOffline: (profileId: string) => void;
  };
  static instance: Connector;

  private constructor() {
    this.events = {
      profileOnline: () => {},
      profileOffline: () => {},
    };

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build();

    this.connection.on("profileOnline", (profile: ProfileHubDTO) => {
      this.events.profileOnline(profile);
    });

    this.connection.on("profileOffline", (profileId: string) => {
      this.events.profileOffline(profileId);
    });

    this.connection.start().catch((err) => {
      console.error("SignalR connection error:", err);
    });
  }

  public static getInstance(): Connector {
    if (!Connector.instance) Connector.instance = new Connector();
    return Connector.instance;
  }

  public async invokeHubMethod<T>(
    methodName: string,
    ...args: T[]
  ): Promise<void> {
    try {
      if (this.connection.state === signalR.HubConnectionState.Disconnected) {
        // Start the connection if it's disconnected
        await this.connection.start();
      }
      // Once the connection is started or if it's already connected, invoke the method
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

export default Connector;
