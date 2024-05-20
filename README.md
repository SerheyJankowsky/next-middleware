# My Next.js Middleware Package

A middleware builder for Next.js that simplifies the creation and management of middleware functions.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Installation

To install the package, run:

```sh
npm install next-middleware
```

## Usage

> Important: In the Path Matching section, I've added an explanation to clarify that middleware is called from right to left when multiple path patterns match

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
} from "my-nextjs-package";

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
- "/api/\_": Matches any path under /api/ (e.g., /api/user, /api/posts).
- "/": Matches the root path.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
