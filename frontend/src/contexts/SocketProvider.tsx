"use client";

import React, { createContext, useContext } from "react";
import { useSocket } from "@/hooks/useSocket";

interface SocketContextType {
  socket: unknown;
  emit: (event: string, data: unknown) => void;
  connect: () => void;
  disconnect: () => void;
}
const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
