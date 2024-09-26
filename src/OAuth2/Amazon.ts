import { OAuth2 } from '../OAuth2';

// Reference Material
// https://developer.amazon.com/docs/login-with-amazon/authorization-code-grant.html
// https://developer.amazon.com/docs/login-with-amazon/register-web.html
// https://developer.amazon.com/docs/login-with-amazon/obtain-customer-profile.html

export class Amazon extends OAuth2 {
    protected user: Record<string, any> = {};
    protected tokens: Record<string, any> = {};
    protected scopes: string[] = ["profile"];

    public getName(): string {
        return 'amazon';
    }

    public parseState(state: string): Record<string, any> {
        return JSON.parse(decodeURIComponent(state));
    }

    public getLoginURL(): string {
        return 'https://www.amazon.com/ap/oa?' + new URLSearchParams({
            response_type: 'code',
            client_id: this.appID,
            scope: this.getScopes().join(' '),
            state: JSON.stringify(this.state),
            redirect_uri: this.callback
        }).toString();
    }

    public async getTokens(code: string): Promise<Record<string, any>> {
        if (Object.keys(this.tokens).length === 0) {
            const headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
            const response = await this.request(
                'POST',
                'https://api.amazon.com/auth/o2/token',
                headers,
                new URLSearchParams({
                    code: code,
                    client_id: this.appID,
                    client_secret: this.appSecret,
                    redirect_uri: this.callback,
                    grant_type: 'authorization_code'
                }).toString()
            );
            this.tokens = JSON.parse(response);
        }
        return this.tokens;
    }

    public async refreshTokens(refreshToken: string): Promise<Record<string, any>> {
        const headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
        const response = await this.request(
            'POST',
            'https://api.amazon.com/auth/o2/token',
            headers,
            new URLSearchParams({
                client_id: this.appID,
                client_secret: this.appSecret,
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            }).toString()
        );
        this.tokens = JSON.parse(response);

        if (!this.tokens['refresh_token']) {
            this.tokens['refresh_token'] = refreshToken;
        }

        return this.tokens;
    }

    public async getUserID(accessToken: string): Promise<string> {
        const user = await this.getUser(accessToken);
        return user['user_id'] || '';
    }

    public async getUserEmail(accessToken: string): Promise<string> {
        const user = await this.getUser(accessToken);
        return user['email'] || '';
    }

    public async isEmailVerified(accessToken: string): Promise<boolean> {
        const email = await this.getUserEmail(accessToken);
        return !!email;
    }

    public async getUserName(accessToken: string): Promise<string> {
        const user = await this.getUser(accessToken);
        return user['name'] || '';
    }

    protected async getUser(accessToken: string): Promise<Record<string, any>> {
        if (Object.keys(this.user).length === 0) {
            const response = await this.request('GET', `https://api.amazon.com/user/profile?access_token=${encodeURIComponent(accessToken)}`);
            this.user = JSON.parse(response);
        }
        return this.user;
    }
}
