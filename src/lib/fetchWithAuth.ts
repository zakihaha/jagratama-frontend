import { auth } from "@/auth";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
) {
  const session = await auth();

  if (!session?.accessToken) {
    throw new Error("No access token available");
  }

  const authHeaders = {
    Authorization: `Bearer ${session.accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...authHeaders,
      ...options.headers,
    },
  });

  return response;
}
