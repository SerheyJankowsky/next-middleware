import { NextResponse } from "next/server";
import { MiddlewareConfig, Req } from "./types";

export class MiddlewareBuilder {
  private config: MiddlewareConfig;

  constructor(c: MiddlewareConfig) {
    this.config = c;
    this.callMiddleware = this.callMiddleware.bind(this);
    this.middlewareStart = this.middlewareStart.bind(this);
    this.createRegExp = this.createRegExp.bind(this);
  }

  public async middlewareStart(req: Req) {
    const { defaultReturn } = this.config;
    try {
      const result = await this.callMiddleware(req);
      if (result instanceof NextResponse) {
        return result;
      }
      if (!defaultReturn) {
        return null;
      }
      return defaultReturn(req, NextResponse, async () => {});
    } catch (error) {
      throw new Error(`Middleware error>>> ${error}`);
    }
  }

  private async callMiddleware(req: Req): Promise<void | NextResponse> {
    const { middleware } = this.config;

    for (let i = middleware.length - 1; i >= 0; i--) {
      const [pathPattern, middlewares] = middleware[i] as any;
      const regex = this.createRegExp(pathPattern);
      let path: any = req.nextUrl.pathname;

      if (this.config.locale) {
        path = path.split("/");
        delete path[0];
        delete path[1];
        path = path.filter((p: string | undefined) => p);
        path = path.join("/");
      }

      if (regex.test(path)) {
        for (const current of middlewares.reverse()) {
          let stopChain = false;

          const next = async () => {
            stopChain = true;
          };

          try {
            const result = await current(req, NextResponse, next);
            if (result instanceof NextResponse) {
              return result;
            }
            if (stopChain) {
              break;
            }
          } catch (error) {
            console.warn(`Error occurred at middleware ${i}:`, error);
            continue;
          }
        }
      }
    }
  }

  private createRegExp(pathPattern: string): RegExp {
    if (pathPattern === "*") {
      return new RegExp(".*");
    } else if (pathPattern.endsWith("/*")) {
      const basePattern = pathPattern
        .slice(0, -2)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`^${basePattern}(/.*)?$`);
    } else {
      const escapedPattern = pathPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`^${escapedPattern}$`);
    }
  }
}
