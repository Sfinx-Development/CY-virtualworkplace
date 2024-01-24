// config.ts
import os from "os";

export function getLocalIPAddress(): string | null {
  if (import.meta.env.VITE_SERVER) {
    const interfaces = os.networkInterfaces();
    let ipAddress = "";

    for (const interfaceName in interfaces) {
      const interfaceInfo = interfaces[interfaceName];
      if (interfaceInfo) {
        for (const info of interfaceInfo) {
          if (info.family === "IPv4" && !info.internal) {
            ipAddress = info.address;
            break;
          }
        }
      }
      if (ipAddress) {
        break;
      }
    }

    return ipAddress;
  } else {
    console.warn("getLocalIPAddress is not supported in the browser.");
    return null;
  }
}
