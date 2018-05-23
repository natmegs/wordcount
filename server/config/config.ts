import * as dotenv from 'dotenv';
dotenv.config();

export const env = process.env.NODE_ENV;

export const database = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER
};

export const server = {
    port: Number(process.env.PORT)
};

export const auth0 = {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
    identifier: process.env.AUTH0_IDENTIFIER,
    issuer: process.env.AUTH0_ISSUER,
    jwksUri: process.env.AUTH0_JWKS_URI
};