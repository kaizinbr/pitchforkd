import { createAuthClient } from "better-auth/react";
import { oneTimeTokenClient } from "better-auth/client/plugins"
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    // baseURL: "https://api.kaizin.work/",
    // trustedOrigins: [
    //     "null",
    //     // "myapp://",
    // ],
    plugins: [
        oneTimeTokenClient(),
        emailOTPClient(),
    ]
});
