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
import {ApiAccess} from "../entity/ApiAccess";

@Authorized('API_ACCESS_CRUD')
@JsonController()
export class ApiAccessController {
    apiAccessRepository: Repository<ApiAccess> = getManager().getRepository(ApiAccess);

    @Get('/apiAccess')
    getAll() {
        return this.apiAccessRepository.find();
    }

    @Get('/apiAccess/:uuid')
    getOne(@Param('uuid') uuid: string) {
        return this.apiAccessRepository.findOne({ uuid })
    }

    @Post('/apiAccess')
    post(@Body() apiAccess: Partial<ApiAccess>) {
        return this.apiAccessRepository.save(apiAccess);
    }

    @Put('/apiAccess/:id')
    put(@Param('id') id: number, @Body() apiAccess: Partial<ApiAccess>) {
        return this.apiAccessRepository.update(id, apiAccess);
    }

    @Delete('/apiAccess/:id')
    remove(@Param('id') id: number) {
        return this.apiAccessRepository.delete(id);
    }
}