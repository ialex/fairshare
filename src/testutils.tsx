import { ThemeProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { setupServer } from "msw/node";

export const server = setupServer();

export const getTestRouter =
  (location: string = "/") =>
  (memoryRouterProps: any) =>
    (
      <MemoryRouter
        initialEntries={[location]}
        initialIndex={0}
        {...memoryRouterProps}
      />
    );

export const queryClient = new QueryClient();
export function ThemeWrapper({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme="light">{children}</ThemeProvider>;
    </QueryClientProvider>
  );
}
