const config = {
    env: process.env.NODE_ENV,
    database: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        server: process.env.DB_SERVER
    },
    server: {
        port: Number(process.env.PORT)
    },
    auth0: {
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENT_ID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET,
        callbackURL: process.env.AUTH0_CALLBACK_URL,
        identifier: process.env.AUTH0_IDENTIFIER,
        issuer: process.env.AUTH0_ISSUER,
        jwksUri: process.env.AUTH0_JWKS_URI
    }
}

module.exports = config;


//"mongodb://natmegs:natalie2938@ds129670.mlab.com:29670/wordcount"