export const firebaseFirestoreErrorMessages: Record<string, string> = {
    "permission-denied": "You don’t have permission to perform this action.",
    unavailable: "Service is temporarily unavailable. Please try again later.",
    cancelled: "The operation was cancelled.",
    "invalid-argument": "Invalid data provided.",
    "deadline-exceeded": "The operation took too long. Please try again.",
    "not-found": "The requested document was not found.",
    "already-exists": "A document with this ID already exists.",
    "resource-exhausted": "Quota exceeded. Please try again later.",
    "failed-precondition":
        "Operation could not be performed due to a failed condition.",
    aborted: "The operation was aborted. Please try again.",
    "out-of-range": "Value is out of the allowed range.",
    "data-loss": "Unrecoverable data loss or corruption.",
    unauthenticated: "Please sign in to continue.",
}

export const firebaseAuthErrorMessages: Record<string, string> = {
    "auth/email-already-in-use": "This email address is already registered.",
    "auth/invalid-email": "The email address is badly formatted.",
    "auth/operation-not-allowed": "Email/password sign-up is not enabled.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/too-many-requests":
        "Too many sign-up attempts. Please try again later.",
    "auth/internal-error": "An internal error occurred. Please try again.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/user-disabled":
        "This account has been disabled. Please contact support.",
    "auth/user-not-found": "No user found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
}
