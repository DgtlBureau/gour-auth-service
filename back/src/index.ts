import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { Action, createKoaServer, getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import bodyParser from 'koa-bodyparser';
import { config } from 'dotenv';
import cors from '@koa/cors';
import * as fs from 'fs';

config();

import { decodeToken, verifyJwt } from './services/jwt.service';
import { AuthController } from './controller/auth.controller';
import { UserController } from './controller/user.controller';
import { RoleController } from './controller/role.controller';
import { AccessController } from './controller/access.controller';
import { SignupController } from './controller/signup.controller';

const PORT = process.env.PORT || 5004;
const args = process.argv.slice(2);

createConnection().then(async () => {
  const app = createKoaServer({
    controllers: [AuthController, UserController, RoleController, AccessController, SignupController],

    authorizationChecker(action: Action, accesses: string[] = []) {
      const accessToken = action.context.cookies.get('AccessToken');
      const user = decodeToken(accessToken) as { accesses: string[] };

      console.log('accesses', accessToken, user);

      if (!verifyJwt(accessToken)) return false;

      if (accesses.length) return accesses.some(a => user.accesses.includes(a));

      return true;
    },
    currentUserChecker(action: Action) {
      const accessToken = action.context.cookies.get('AccessToken');

      return decodeToken(accessToken);
    },
  });

  if (args.includes('config')) {
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage);

    fs.writeFile('./open-api.json', JSON.stringify(spec), err => {
      console.log(err);
      process.exit();
    });

    return;
  }

  // app.use(mount('/static', serve(process.env.STORE_FOLDER_PATH)))

  app
    .use(bodyParser())
    .use(
      cors({
        credentials: true,
        keepHeadersOnError: true,
      })
    )
    .listen(PORT, () => {
      console.log(`Server was started at ${PORT}`);
    });

  app.use((req: Request) => {
    console.log(req);
  });
});
