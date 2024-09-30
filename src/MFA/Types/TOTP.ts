import { totp } from 'otplib';

// Define the type of user document
interface Document {
    attributes: Record<string, any>;
    getAttribute(key: string, defaultValue?: any): any;
}

export class TOTP {
    private instance: any;

    constructor(secret?: string | null) {
        this.instance = totp;
        this.instance.options = { step: 30 }; // Example of options, you can configure as needed
        if (secret) {
            this.instance.secret = secret;
        }
    }

    // Static method to get the authenticator from the user object
    public static getAuthenticatorFromUser(user: Document): Document | null {
        const authenticators = user.getAttribute('authenticators', []);
        for (const authenticator of authenticators) {
            if (authenticator.type === 'TOTP') {
                return authenticator;
            }
        }
        return null;
    }
}
