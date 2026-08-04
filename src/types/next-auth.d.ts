import type { DefaultSession } from "next-auth";

import type { Role } from "../../generated/prisma/client";

/**
 * Module augmentation for the app's custom session/JWT/user shape — role,
 * id, and the JWT-revocation fields threaded through auth.config.ts and
 * auth.ts. Augmented on both the `next-auth`/`next-auth/jwt` entry points
 * *and* the underlying `@auth/core` modules they re-export from — this
 * next-auth v5 beta's `export type {...} from "@auth/core/types"` re-export
 * style doesn't create a local interface declaration for the `next-auth`
 * augmentation alone to merge into, so both are declared to be safe.
 */

declare module "next-auth" {
  interface User {
    role: Role;
    tokenVersion?: number;
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
    /** Set when the JWT's embedded `tokenVersion` no longer matches the
     * database (e.g. the user changed their password elsewhere) — every
     * auth guard treats this the same as "no session". */
    error?: "SessionRevoked";
  }
}

declare module "@auth/core/types" {
  interface User {
    role: Role;
    tokenVersion?: number;
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
    error?: "SessionRevoked";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    tokenVersion?: number;
    tokenVersionCheckedAt?: number;
    revoked?: boolean;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    tokenVersion?: number;
    tokenVersionCheckedAt?: number;
    revoked?: boolean;
  }
}
