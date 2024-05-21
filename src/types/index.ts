import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export type NextHandler = () => Promise<void>;

export type Req = NextRequest;
export type Res = typeof NextResponse;

export type MiddlewareFunction = (
  req: NextRequest,
  res: typeof NextResponse,
  next: () => Promise<void>
) => Promise<NextResponse<unknown> | void> | NextResponse<unknown> | void;

export type MiddlewareConfig = {
  middleware: [string, MiddlewareFunction[]][];
  defaultReturn?: MiddlewareFunction;
  locale?: boolean;
};
