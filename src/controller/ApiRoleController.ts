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
import {ApiRole} from "../entity/ApiRole";

@Authorized('API_ROLE_CRUD')
@JsonController()
export class ApiRoleController {
    apiRoleRepository: Repository<ApiRole> = getManager().getRepository(ApiRole);

    @Get('/apiRoles')
    getAll() {
        return this.apiRoleRepository.find();
    }

    @Get('/apiRoles/:uuid')
    getOne(@Param('uuid') uuid: string) {
        return this.apiRoleRepository.findOne({ uuid })
    }

    @Post('/apiRoles')
    post(@Body() apiRole: Partial<ApiRole>) {
        return this.apiRoleRepository.save(apiRole);
    }

    @Put('/apiRoles/:id')
    put(@Param('id') id: number, @Body() apiRole: Partial<ApiRole>) {
        return this.apiRoleRepository.update(id, apiRole);
    }

    @Delete('/apiRoles/:id')
    remove(@Param('id') id: number) {
        return this.apiRoleRepository.delete(id);
    }
}