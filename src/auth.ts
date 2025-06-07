import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { API_V1_BASE_URL } from "./lib/config";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt" // Menggunakan JWT type dari next-auth/jwt

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        try {
          const res = await fetch(`${API_V1_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();

          if (!res.ok) {
            return null;
          }

          return {
            id: user.data.id,
            name: user.data.name,
            email: user.data.email,
            token: user.data.token,
            refreshToken: user.data.refresh_token,
            position: user.data.position,
            role: user.data.role,
            image: user.image
          };
        } catch (error) {
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is not null, it means the user just logged in
      // and we can add the user information to the token (create a JWT)
      if (user) {
        token.accessToken = (user as any).token; // Store your API token inside the JWT
        token.refreshToken = (user as any).refreshToken; // Store refresh token
        token.role = (user as any).role; // Store user role
        token.id = (user as any).id; // Store user id
        token.position = (user as any).position; // Store user position
        token.image = (user as any).image;

        if ((user as any).token) {
          const decoded = jwtDecode((user as any).token);
          token.accessTokenExp = decoded.exp; // Store expiration time
        }
      }

      // // check jwt backend expiration
      const isExpired = (token as any).accessTokenExp < Math.floor(Date.now() / 1000);
      if (isExpired) {
        try {
          token = await refreshAccessToken(token);
  
          // update the token expiration time
          if (token.accessToken) {
            const decoded = jwtDecode((token as any).accessToken);
            token.accessTokenExp = decoded.exp; // Store expiration time
          }
        } catch (error) {
          return null; // If refresh fails, return null to trigger signOut          
        }
      }

      return token;
    },
    async session({ session, token }) {
      // custom data to be sent to the client
      if (session.user) {
        (session as any).user.id = token.id; // Add user id to session
        (session as any).accessToken = token.accessToken;
        (session as any).user.role = token.role; // Add user role to session
        (session as any).user.position = token.position; // Add user position to session
        (session as any).user.image = token.image; // Add user image to session
      }

      return session;
    },
  },
  events: {
    async signOut(params: { token?: JWT | null; session?: any | null }) {
      // console.log('============== async signOut ==============');
      // console.log("SignOut Event:", params);
      if (params.token?.accessToken) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_V1_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${params.token.accessToken}`,
            },
          });

          if (!response.ok) {
            // console.error("SignOut: Gagal memanggil endpoint logout Golang:", response.status);
          } else {
            // console.log("SignOut: Sukses memanggil endpoint logout Golang.");
          }
        } catch (error) {
          // console.error("SignOut: Exception saat memanggil endpoint logout Golang:", error);
        }
      }
    }
  },
})

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${API_V1_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: token.refreshToken,
      }),
    });

    const refreshed = await res.json();

    if (!res.ok) throw refreshed;

    return {
      ...token,
      accessToken: refreshed.data.token,
    };
  } catch (err) {
    throw new Error("Failed to refresh access token");
  }
}
