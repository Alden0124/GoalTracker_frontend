import ProfileSkeleton from "@/components/Profile/ProfileInfo/skeleton/ProfileSkeleton";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 延遲載入組件
const ProtectedRoute = lazy(() => import("@/router/ProtectedRoute"));
const DefaultLayout = lazy(() => import("@/layout/DefaultLayout"));
const AuthLayout = lazy(() => import("@/layout/AuthLayout"));
const ErrorPage = lazy(() => import("@/pages/Error"));
const Home = lazy(() => import("@/pages/Home"));
const SignIn = lazy(() => import("@/pages/Auth/SignIn"));
const SignUp = lazy(() => import("@/pages/Auth/SignUp"));
const Forget = lazy(() => import("@/pages/Auth/ForgetPassword"));
const SendCode = lazy(() => import("@/pages/Auth/SendCode"));
const VerifyCode = lazy(() => import("@/pages/Auth/VerifyCode"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));
const Profile = lazy(() => import("@/pages/Profile"));
const Feed = lazy(() => import("@/pages/Feed"));
const ChatRoom = lazy(() => import("@/pages/ChatRoom"));
const ChatRoomId = lazy(() => import("@/pages/ChatRoom/Id"));

const routes = [
  {
    path: "*",
    element: (
      <Suspense fallback={<div className="h-screen"></div>}>
        <NotFoundPage />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<div className="h-screen"></div>}>
        <ProtectedRoute />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div className="h-screen"></div>}>
            <DefaultLayout />
          </Suspense>
        ),
        children: [
          {
            path: "/home",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <Home />
              </Suspense>
            ),
          },
          {
            path: "profile/:id",
            element: (
              <Suspense fallback={<ProfileSkeleton />}>
                <Profile />
              </Suspense>
            ),
          },
          {
            path: "feed",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <Feed />
              </Suspense>
            ),
          },
          {
            path: "chatRoom",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <ChatRoom />
              </Suspense>
            ),
            children: [
              {
                path: ":id",
                element: (
                  <Suspense fallback={<div className="h-screen"></div>}>
                    <ChatRoomId />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "auth",
        element: (
          <Suspense fallback={<div className="h-screen"></div>}>
            <AuthLayout />
          </Suspense>
        ),
        children: [
          {
            path: "signIn",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <SignIn />
              </Suspense>
            ),
          },
          {
            path: "signUp",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <SignUp />
              </Suspense>
            ),
          },
          {
            path: "forget",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <Forget />
              </Suspense>
            ),
          },
          {
            path: "sendCode",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <SendCode />
              </Suspense>
            ),
          },
          {
            path: "verifyCode",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <VerifyCode />
              </Suspense>
            ),
          },
          {
            path: "resetPassword",
            element: (
              <Suspense fallback={<div className="h-screen"></div>}>
                <ResetPassword />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
    v7_fetcherPersist: true,
  },
});

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
