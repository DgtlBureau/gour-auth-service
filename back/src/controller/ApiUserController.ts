import {
    Param,
    Body,
    Get,
    Post,
    Put,
    Delete,
    JsonController,
    Authorized,
} from 'routing-controllers';
import {getManager, Repository} from "typeorm";
import {ApiUser} from "../entity/ApiUser";

@Authorized('API_USER_CRUD')
@JsonController()
export class ApiUserController {
    apiUserRepository: Repository<ApiUser> = getManager().getRepository(ApiUser);

    @Get('/apiUsers')
    getAll() {
        return this.apiUserRepository.find();
    }

    @Get('/apiUsers/:uuid')
    getOne(@Param('uuid') uuid: string) {
        return this.apiUserRepository.findOne({ uuid })
    }

    @Post('/apiUsers')
    post(@Body() apiUser: Partial<ApiUser>) {
        return this.apiUserRepository.save(apiUser);
    }

    @Put('/apiUsers/:uuid')
    put(@Param('uuid') uuid: string, @Body() apiUser: Partial<ApiUser>) {
        return this.apiUserRepository.save({
            ...apiUser,
            uuid
        });
    }

    @Delete('/apiUsers/:id')
    remove(@Param('id') id: number) {
        return this.apiUserRepository.delete(id);
    }
}