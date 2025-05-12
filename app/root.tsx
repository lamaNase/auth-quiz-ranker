import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";
import Error from "~/components/utils/Error";
import "~/styles/shared.css";
import Modal from "./components/utils/Modal";

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link
          href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <Links />
      </head>
      <body>
        <Modal>
          <Error
            title={
              isRouteErrorResponse(error)
                ? error.status + " " + error.statusText
                : "Something went wrong"
            }
          >
            <main>
              <p>
                {isRouteErrorResponse(error) ? error.data : error.message}
              </p>
              <p>
                <Link to="/">safety</Link> Back to
              </p>
            </main>
          </Error>
        </Modal>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
