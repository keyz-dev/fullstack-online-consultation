"use client";

import React from "react";
import IncomingCallNotification from "./IncomingCallNotification";
import { useIncomingCall } from "@/hooks/useIncomingCall";

const IncomingCallWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { incomingCall, isCallVisible, acceptCall, declineCall } = useIncomingCall();

  return (
    <>
      {children}
      <IncomingCallNotification
        isVisible={isCallVisible}
        callData={incomingCall}
        onAccept={acceptCall}
        onDecline={declineCall}
      />
    </>
  );
};

export default IncomingCallWrapper;
