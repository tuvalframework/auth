import { OAuth2 } from '../OAuth2';

// Reference Material
// https://dev.twitch.tv/docs/authentication

export class Twitch extends OAuth2 {
    private endpoint: string = 'https://id.twitch.tv/oauth2/';
    private resourceEndpoint: string = 'https://api.twitch.tv/helix/users';
    protected scopes: string[] = [
        'user:read:email',
    ];
    protected user: Record<string, any> = {};
    protected tokens: Record<string, any> = {};

    public getName(): string {
        return 'twitch';
    }

    public getLoginURL(): string {
        return this.endpoint + 'authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: this.appID,
            scope: this.getScopes().join(' '),
            redirect_uri: this.callback,
            force_verify: 'true',
            state: JSON.stringify(this.state)
        }).toString();
    }

    public async getTokens(code: string): Promise<Record<string, any>> {
        if (Object.keys(this.tokens).length === 0) {
            const response = await this.request(
                'POST',
                this.endpoint + 'token?' + new URLSearchParams({
                    client_id: this.appID,
                    client_secret: this.appSecret,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: this.callback
                }).toString()
            );
            this.tokens = JSON.parse(response);
        }
        return this.tokens;
    }

    public async refreshTokens(refreshToken: string): Promise<Record<string, any>> {
        const response = await this.request(
            'POST',
            this.endpoint + 'token?' + new URLSearchParams({
                client_id: this.appID,
                client_secret: this.appSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
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
        return user['id'] || '';
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
        return user['display_name'] || '';
    }

    protected async getUser(accessToken: string): Promise<Record<string, any>> {
        if (Object.keys(this.user).length === 0) {
            const response = await this.request(
                'GET',
                this.resourceEndpoint,
                {
                    'Authorization': 'Bearer ' + encodeURIComponent(accessToken),
                    'Client-Id': encodeURIComponent(this.appID)
                }
            );
            const data = JSON.parse(response);
            this.user = data['data'][0] || {};
        }
        return this.user;
    }
}
