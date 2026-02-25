import { cookies, headers } from "next/headers";

export async function getAuthToken() {
  // From cookie
  const cookieStore = await cookies();
  const tokenFromCookie = cookieStore.get("token")?.value;

  // From Authorization header
  const headerList = await headers();
  const tokenFromHeader = headerList
    .get("authorization")
    ?.replace("Bearer ", "");

  return tokenFromHeader || tokenFromCookie || null;
}