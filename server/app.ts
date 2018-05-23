import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as path from 'path';

import { UsersController } from './controllers';
import * as config from './config/config';

dotenv.config();

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.configDatabase();
        this.configMiddleware();
    }

    private configMiddleware(): void {
        // Set up middleware
        this.app.use(cors());
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // Set up authentication middleware
        const checkJwt = jwt({
            secret: jwksRsa.expressJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: config.auth0.jwksUri
            }),
            audience: config.auth0.identifier,
            issuer: config.auth0.issuer,
            algorithms: ['RS256']
        });

        this.app.use(checkJwt);

        // Set up routes
        this.app.use('/api/users', UsersController);

        // Index route
        this.app.get('/', (req, res) => {
          res.send('Invalid Endpoint');
        });
        
        this.app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, 'public/index.html'));
        });

        // catch 404 and forward to error handler
        this.app.use(function(req: express.Request, res: express.Response, next: express.NextFunction) {
          let err: any = new Error('Not Found');
          err.status = 404;
          next(err);
        });
        
        // error handler
        this.app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = req.app.get('env') === 'development' ? err : {};
        
          // render the error page
          res.sendStatus(err.status || 500);
        });
    }

    private configDatabase(): void {
        mongoose.connect(config.database.server);

        mongoose.connection.on('connected', () => {
          console.log('Connected to database');
        });
        
        mongoose.connection.on('error', (err) => {
          console.log("Error connecting to database: ", err);
        });
    }
}

export default new App().app;