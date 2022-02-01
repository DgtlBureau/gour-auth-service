import "reflect-metadata";
import {createConnection} from "typeorm";
import bodyParser from "koa-bodyparser";
import {config} from 'dotenv'
config();

import cors from '@koa/cors';
import {Action, createKoaServer, getMetadataArgsStorage} from "routing-controllers";
import {decodeToken, verifyJwt} from "./services/jwtService";
import {routingControllersToSpec} from "routing-controllers-openapi";
import * as fs from "fs";
import {AuthController} from "./controller/AuthController";
import {ApiUserController} from "./controller/ApiUserController";
import {ApiRoleController} from "./controller/ApiRoleController";
import {ApiAccessController} from "./controller/ApiAccessController";
import {SignupController} from "./controller/SignupController";

const PORT = process.env.PORT || 5002;
const args = process.argv.slice(2);

createConnection().then(async connection => {
    const app = createKoaServer({
        controllers: [
            AuthController,
            ApiUserController,
            ApiRoleController,
            ApiAccessController,
            SignupController,
        ],
        authorizationChecker(action: Action, accesses: string[] = []) {
            const accessToken = action.context.cookies.get('AccessToken');
            const user = decodeToken(accessToken) as {accesses: string[]};

            if(!verifyJwt(accessToken)) {
                return false
            }

            if(accesses.length) {
                return accesses.some(a => user.accesses.includes(a))
            }

            return true
        },
        currentUserChecker(action: Action) {
            const accessToken = action.context.cookies.get('AccessToken');
            return decodeToken(accessToken)
        }
    })

    if(args.includes('config')) {

        const storage = getMetadataArgsStorage()
        const spec = routingControllersToSpec(storage)
        fs.writeFile('./open-api.json', JSON.stringify(spec), err => {
            console.log(err);
            process.exit();
        });

        return
    }

    // app.use(mount('/static', serve(process.env.STORE_FOLDER_PATH)))

    app.use(bodyParser())
        .use(cors({
            credentials: true,
            keepHeadersOnError: true,
        }))
        .listen(PORT, () => {
            console.log(`Server was started at ${PORT}`)
        });

    app.use((req: Request) => console.log(req.url))
});