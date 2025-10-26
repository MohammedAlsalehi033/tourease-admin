import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// The client-side 'auth' object from firebase is no longer needed in this file.
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshFirebaseToken(token) {
  try {
    const url = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_WEB_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    // Give a 5-minute buffer for expiry
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const expiresIn = parseInt(refreshedTokens.expires_in, 10);
    
    return {
      ...token, // Keep the old properties
      firebaseToken: refreshedTokens.id_token,
      expiresAt: nowInSeconds + expiresIn - 300,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error("Error refreshing access token", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        firebaseToken: { label: "Firebase Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        // Check if this is an OAuth sign-in (has firebaseToken)
        if (credentials.firebaseToken) {
          try {
            // Verify the Firebase token
            const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.FIREBASE_WEB_API_KEY}`;
            const verifyResponse = await fetch(verifyUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                idToken: credentials.firebaseToken,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.users && verifyData.users[0]) {
              const user = verifyData.users[0];
              const nowInSeconds = Math.floor(Date.now() / 1000);
              
              // Get a fresh token and refresh token
              const refreshUrl = `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_WEB_API_KEY}`;
              const refreshResponse = await fetch(refreshUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  grant_type: 'refresh_token',
                  refresh_token: credentials.firebaseToken,
                }),
              });

              const refreshData = await refreshResponse.json();
              const expiresIn = parseInt(refreshData.expires_in || '3600', 10);

              return {
                id: user.localId,
                email: user.email,
                name: user.displayName || user.email.split('@')[0],
                image: user.photoUrl || null,
                firebaseToken: refreshData.id_token || credentials.firebaseToken,
                refreshToken: refreshData.refresh_token || credentials.firebaseToken,
                expiresAt: nowInSeconds + expiresIn - 300,
              };
            }
          } catch (error) {
            console.error("Firebase token verification error:", error);
            return null;
          }
        }

        // Regular email/password sign-in
        if (!credentials?.password) return null;

        try {
          const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                returnSecureToken: true,
              }),
            }
          );
            
          const user = await res.json();

          if (res.ok && user.idToken) {
            const nowInSeconds = Math.floor(Date.now() / 1000);
            const expiresIn = parseInt(user.expiresIn, 10);

            return {
              id: user.localId,
              email: user.email,
              name: user.displayName || user.email.split('@')[0],
              image: null, 
              firebaseToken: user.idToken,
              refreshToken: user.refreshToken,
              expiresAt: nowInSeconds + expiresIn - 300, 
            };
          } else {
            console.error("Firebase Auth Error:", user?.error?.message);
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      // 1. Initial sign in: The 'user' object is passed from 'authorize'
      if (user) {
        token.firebaseToken = user.firebaseToken;
        token.expiresAt = user.expiresAt;
        token.refreshToken = user.refreshToken;
        token.sub = user.id; // NextAuth uses 'sub' for the user id
        return token;
      }
      
      // 2. On subsequent requests, check if token is expired
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const isExpired = nowInSeconds > token.expiresAt;

      if (isExpired) {
        console.log("Firebase token has expired. Refreshing...");
        return refreshFirebaseToken(token);
      }
      
      // 3. Token is still valid, just return it
      return token;
    },
    async session({ session, token }) {
      // The 'session' callback receives the 'token' from the 'jwt' callback
      // We add the custom properties to the session object so our client can access them
      if (session.user) {
        session.user.id = token.sub; // Pass Firebase UID
      }
      // I am keeping your original property name "firebaseToken" on the user object for consistency
      session.user.firebaseToken = token.firebaseToken; 
      session.error = token.error;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };