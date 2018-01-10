export class AuthenticationError extends Error {

    /**
     * Initializes the AuthenticationError instance
     * @param message The message of the error
     */
    constructor(message?: string) {
        super(message);
    }
}
