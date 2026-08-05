"use server";

import { cookies } from "next/headers";

const RECENTLY_VIEWED_COOKIE = "recently_viewed";
const MAX_RECENTLY_VIEWED = 12;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export async function recordRecentlyViewedAction(
  productId: string,
): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(RECENTLY_VIEWED_COOKIE)?.value;

  let ids: string[] = [];
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        ids = parsed.filter((id): id is string => typeof id === "string");
      }
    } catch {
      ids = [];
    }
  }

  const next = [productId, ...ids.filter((id) => id !== productId)].slice(
    0,
    MAX_RECENTLY_VIEWED,
  );

  cookieStore.set(RECENTLY_VIEWED_COOKIE, JSON.stringify(next), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}
