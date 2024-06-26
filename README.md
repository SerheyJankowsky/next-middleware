# Next.js Middleware Package

A middleware builder for Next.js that simplifies the creation and management of middleware functions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [withMiddleware](#withMiddleware)
- [License](#license)

## Installation

To install the package, run:

```sh
npm i @serhiitupilow/next-middleware
```

## Usage

> Important: In the Path Matching section, I've added an explanation to clarify that middleware is called from right to left when multiple path patterns match

```ts
import {
  MiddlewareBuilder,
  NextRequest,
  NextResponse,
} from "@serhiitupilow/next-middleware";

const myMiddleware = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Your middleware logic here
  console.log("Request received");
};

const builder = new MiddlewareBuilder({
  middleware: [["*", [myMiddleware]]],
  defaultReturn: async (req, res, next) => {
    return res.next();
  },
});

export default function middleware(req: NextRequest) {
  return builder.middlewareStart(req);
}
```

### Request (req: NextRequest)

The req parameter represents the incoming HTTP request object. It contains information about the client's request, such as the URL, HTTP method, headers, query parameters, and request body. In your case, you're using NextRequest, which likely extends the standard Node.js http.IncomingMessage class with additional properties and methods provided by Next.js.

### Response (res: typeof NextResponse)

The res parameter represents the HTTP response object that will be sent back to the client. It allows you to set response headers, status codes, and send data back to the client. In your case, you're using typeof NextResponse, indicating that res should be an instance of the NextResponse class provided by Next.js. This class likely extends the standard Node.js http.ServerResponse class with additional Next.js-specific functionality.

### Stop Function (next: () => Promise<void>)

The next parameter is a function that, when called, stop call chain middleware

## Configuration

Middleware Configuration
The MiddlewareBuilder accepts a configuration object with the following properties:

- middleware: An array of tuples where each tuple contains a string (path pattern) and an array of middleware functions.
- defaultReturn (optional): A fallback middleware function to be executed if no other middleware returns a NextResponse.
- locale (optional): A boolean indicating whether to handle locale-based paths.

### Example Configuration:

```ts
import {
  MiddlewareBuilder,
  NextRequest,
  NextResponse,
} from "@serhiitupilow/next-middleware";

const myMiddleware1 = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Middleware logic
  console.log("Middleware 1 executed");
};

const myMiddleware2 = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Middleware logic
  console.log("Middleware 2 executed");
};

const builder = new MiddlewareBuilder({
  middleware: [
    ["/api/*", [myMiddleware1, myMiddleware2]], // Middleware for API routes
    ["/", [myMiddleware1]], // Middleware for root route
  ],
  defaultReturn: async (req, res, next) => {
    return res.next();
  },
  locale: true, // Handle locale-based paths
});

export default function middleware(req: NextRequest) {
  return builder.middlewareStart(req);
}
```

### Path Pattern Examples

- "\*": Matches any path.
- "/dashboard/\*": Matches any path under /dashboard/ (e.g., /dashboard/user, /dashboard/posts).
- "/": Matches the root path.

## withMiddleware HOC

This package provides a higher-order component (HOC) that enables you to apply middleware functions to a Next.js page component. Middleware functions can be asynchronous and have the ability to modify a shared context object. The execution of middleware functions can be controlled using a `next` function, witch stop call next middleware. Function calls from left to right.

### Usage

Use the withMiddleware HOC with a Next.js page component

```ts
import { FC } from "react";
import {
  withMiddleware,
  TPageMiddleware,
} from "@serhiitupilow/next-middleware";

type Context = {
  user: {
    name: string;
    data: Array<any>;
  };
};

// Sample middleware functions
const middleware1: TPageMiddleware<Context> = async (ctx, next) => {
  await new Promise(() => setTimeout({
    ctx.user = "Vasa";
  }, 1000));
};

const middleware2: TPageMiddleware<any> = async (ctx) => {
  ctx.data = ["1", "2"];
};

// Next.js page component
const MyPage: FC<Context> = (props) => {
  return (
    <div>
      <h1>My Page</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};
export default withMiddleware<Context>([middleware1, middleware2])(MyPage);
```

### Types

```ts
export type TPageMiddleware<T> = (ctx?: T, next?: () => void) => Promise<void>;
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

```

```
