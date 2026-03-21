import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AppLayout from "./components/layout/AppLayout";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import BookmarksPage from "./pages/BookmarksPage";
import CategoryPage from "./pages/CategoryPage";
import CreateEditArticlePage from "./pages/CreateEditArticlePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const queryClient = new QueryClient();

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Layout route
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: AppLayout,
});

// Page routes
const homeRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: HomePage,
});

const articleDetailRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/article/$id",
  component: ArticleDetailPage,
});

const articleNewRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/article/new",
  component: CreateEditArticlePage,
});

const articleEditRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/article/edit/$id",
  component: CreateEditArticlePage,
});

const categoryRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/category/$name",
  component: CategoryPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const loginRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/register",
  component: RegisterPage,
});

const bookmarksRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/bookmarks",
  component: BookmarksPage,
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    homeRoute,
    articleNewRoute,
    articleDetailRoute,
    articleEditRoute,
    categoryRoute,
    dashboardRoute,
    loginRoute,
    registerRoute,
    bookmarksRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}
