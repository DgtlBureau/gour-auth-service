import { Body, Controller, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm'
import { ApiUser } from 'src/entity/ApiUser'
import { Repository } from 'typeorm'

import { SignUpService } from './sign-up.service';
// import { CreateSignUpDto } from './dto/create-sign-up.dto';
// import { UpdateSignUpDto } from './dto/update-sign-up.dto';

@Controller('sign-up')
export class SignUpController {
  constructor(
    private readonly signUpService: SignUpService,
    @InjectRepository(ApiUser)
    private usersRepository: Repository<ApiUser>,
  ) {}

  @Get()
  @MessagePattern('signup')
  create(@Body() createSignUpDto: any) {
    return this.usersRepository.find();
    // return this.signUpService.create(createSignUpDto);
  }

  // @MessagePattern('findAllSignUp')
  // findAll() {
  //   return this.signUpService.findAll();
  // }

  // @MessagePattern('findOneSignUp')
  // findOne(@Payload() id: number) {
  //   return this.signUpService.findOne(id);
  // }

  // @MessagePattern('updateSignUp')
  // update(@Payload() updateSignUpDto: UpdateSignUpDto) {
  //   return this.signUpService.update(updateSignUpDto.id, updateSignUpDto);
  // }

  // @MessagePattern('removeSignUp')
  // remove(@Payload() id: number) {
  //   return this.signUpService.remove(id);
  // }
}
