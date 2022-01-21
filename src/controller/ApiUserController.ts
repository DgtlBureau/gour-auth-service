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

    @Get('/apiUsers/:id')
    getOne(@Param('id') id: number) {
        return this.apiUserRepository.findOne({id})
    }

    @Post('/apiUsers')
    post(@Body() apiUser: Partial<ApiUser>) {
        return this.apiUserRepository.save(apiUser);
    }

    @Put('/apiUsers/:id')
    put(@Param('id') id: number, @Body() apiUser: Partial<ApiUser>) {
        return this.apiUserRepository.update(id, apiUser);
    }

    @Delete('/apiUsers/:id')
    remove(@Param('id') id: number) {
        return this.apiUserRepository.delete(id);
    }
}