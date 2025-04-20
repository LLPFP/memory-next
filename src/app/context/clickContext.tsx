import React, { createContext, useContext, useState } from "react";

type ClickContextType = {
  totalClicks: number;
  incrementClicks: () => void;
};

const ClickContext = createContext<ClickContextType | undefined>(undefined);

export const ClickProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [totalClicks, setTotalClicks] = useState(0);

  const incrementClicks = () => {
    setTotalClicks(totalClicks + 1);
  };

  return (
    <ClickContext.Provider value={{ totalClicks, incrementClicks }}>
      {children}
    </ClickContext.Provider>
  );
};

export const useClickContext = () => {
  const context = useContext(ClickContext);
  if (!context) {
    throw new Error("useClickContext must be used within a ClickProvider");
  }
  return context;
};
