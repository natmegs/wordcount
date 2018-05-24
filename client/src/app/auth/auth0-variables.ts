import { environment } from '../../environments/environment';

interface AuthConfig {
    clientId: string;
    domain: string;
    audience: string;
    callbackURL: string;
    apiUrl: string;
    apiIdentifier: string;
}

export const AUTH_CONFIG: AuthConfig = {
    clientId: environment.auth0_clientId,
    domain: environment.auth0_domain,
    audience: environment.auth0_audience,
    callbackURL: environment.callbackUrl,
    apiUrl: environment.apiUrl,
    apiIdentifier: environment.auth0_api_identifier
};