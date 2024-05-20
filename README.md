# My Next.js Middleware Package

A middleware builder for Next.js that simplifies the creation and management of middleware functions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)

## Installation

To install the package, run:

```sh
npm install next-middleware
```

## Usage

```ts
import {
  MiddlewareBuilder,
  NextRequest,
  NextResponse,
} from "my-nextjs-package";

const myMiddleware = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Your middleware logic here
  console.log("Request received");
  await next();
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
} from "my-nextjs-package";

const myMiddleware1 = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Middleware logic
  console.log("Middleware 1 executed");
  await next();
};

const myMiddleware2 = async (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => {
  // Middleware logic
  console.log("Middleware 2 executed");
  await next();
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

- "\_": Matches any path.
- "/api/\_": Matches any path under /api/ (e.g., /api/user, /api/posts).
- "/": Matches the root path.
