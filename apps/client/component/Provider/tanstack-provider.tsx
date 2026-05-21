"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type TanstackProviderProps = {
  children: React.ReactNode;
};

export function TanstackProvider({ children }: TanstackProviderProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}