import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/app/layouts/root-layout";
import { FoundationPage } from "@/app/pages/foundation-page";

export const appRouter = createBrowserRouter([
  { path: "/", element: <RootLayout />, children: [{ index: true, element: <FoundationPage /> }] },
]);
