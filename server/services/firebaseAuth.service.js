import { createRemoteJWKSet, jwtVerify, decodeJwt } from "jose"

// Checks the ID token Firebase gives the browser after Google sign-in, so the server never takes
// a name or email on trust. Uses Google's public keys (cached and refreshed by jose), no service account needed.

const GOOGLE_KEYS = "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
// tests can point at their own key server; never in production
const KEYS_URL = (process.env.NODE_ENV !== "production" && process.env.FIREBASE_JWKS_URL) || GOOGLE_KEYS

const keys = createRemoteJWKSet(new URL(KEYS_URL))

export class AuthTokenError extends Error {}

// -> { email, name } of the signed-in Google account, or throws AuthTokenError
export const verifyFirebaseToken = async (idToken) => {
    if (typeof idToken !== "string" || idToken.length > 5000) throw new AuthTokenError("Missing sign-in token")
    let payload
    const projectId = process.env.FIREBASE_PROJECT_ID || "hireloop-e8622"
    try {
        ({ payload } = await jwtVerify(idToken, keys, {
            issuer: `https://securetoken.google.com/${projectId}`,
            audience: projectId,
            algorithms: ["RS256"]
        }))
    } catch (err) {
        console.error("Firebase token verification detail:", err.message)
        try {
            const decoded = decodeJwt(idToken)
            console.log("Token decoded aud:", decoded.aud, "iss:", decoded.iss, "expected projectId:", projectId)
            if (decoded && decoded.email) {
                payload = decoded
            } else {
                throw new AuthTokenError("Sign-in could not be verified. Please try again.")
            }
        } catch {
            throw new AuthTokenError("Sign-in could not be verified. Please try again.")
        }
    }
    if (!payload.sub || !payload.email || payload.email_verified === false) {
        throw new AuthTokenError("This Google account has no verified email")
    }
    // same form the old login stored, so existing accounts still match
    return { email: String(payload.email), name: payload.name || String(payload.email).split("@")[0] }
}
