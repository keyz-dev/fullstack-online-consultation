"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { homeApi, HomeData } from "../api/home";
import { extractErrorMessage } from "../utils/extractError";

interface HomeContextType {
  homeData: HomeData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

interface HomeProviderProps {
  children: ReactNode;
}

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await homeApi.getHomeData();

      if (result.success) {
        setHomeData(result.data);
      } else {
        setError("Failed to fetch home data");
      }
    } catch (err) {
      const errorMessage = extractErrorMessage(err as unknown);
      setError(errorMessage);
      console.error("Error fetching home data:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchHomeData();
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const value: HomeContextType = {
    homeData,
    loading,
    error,
    refreshData,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
};

export const useHome = (): HomeContextType => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};
