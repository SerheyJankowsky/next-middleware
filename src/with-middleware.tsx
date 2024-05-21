import React, { FC } from "react";
import { TPageMiddleware } from "./types";

export function withMiddleware<T extends Record<string, any>>(
  middleware: TPageMiddleware<T>[],
  initialCtx: T = {} as T
) {
  return function (Page: FC<T>) {
    return async function Component(props: T) {
      let ctx = { ...initialCtx };
      let next = false;

      const nextHandler = () => {
        next = true;
      };

      const middlewarePromises = middleware.map(async (m) => {
        if (!next) {
          await m(ctx, nextHandler);
        }
      });

      // Execute middleware concurrently and resolve when any resolves or all finished
      await Promise.race([
        Promise.all(middlewarePromises), // Wait for all middleware to finish
      ]);

      return <Page {...ctx} {...props} />;
    };
  };
}
