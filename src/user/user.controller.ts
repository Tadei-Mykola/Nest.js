import { Controller, Post, Body, Patch, Param, HttpStatus, HttpException, UseGuards, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorizationUserDto } from './dto/authorization-user.dto';
import { TypeAuthorization } from '../shared/enum/authorization-user-type.enum';
import { User } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.create(createUserDto);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    } else {
      const jwt = await this.authService.generateJwt(user);
      return jwt;
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getUser')
  getUser(@Request() req){
    return req.user;
  }

  @Post('authorization/:type')
  async authorization(@Param('type') type: TypeAuthorization, @Body() authorizationUserDto: AuthorizationUserDto) {
    const { login, password } = authorizationUserDto;
    let user: User
    if (!login || !password) {
      throw new HttpException('Invalid authorization data', HttpStatus.BAD_REQUEST);
    }
    if (type === TypeAuthorization.Phone) {
      user = await this.userService.authorizeByPhone(login, password);
    } else if (type === TypeAuthorization.Email) {
      user = await this.userService.authorizeByEmail(login, password);
    } else {
      throw new HttpException('Invalid authorization type', HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throw new HttpException('Invalid authorization data', HttpStatus.NOT_FOUND);
    } else if (user.isDeactivate) {
      throw new HttpException('User is deactivated', HttpStatus.FORBIDDEN);
    } else {
      const jwt = await this.authService.generateJwt(user);
      return jwt;
    }
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (!updateUserDto) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }

    if (updateUserDto.isDeactivate) {
      const req = await this.userService.deactivate(+id)
      if (req.affected === 0) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException('User deactivated', HttpStatus.OK);;
      }
    } else {
      const user = await this.userService.update(+id, updateUserDto);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      } else {
        const jwt = await this.authService.generateJwt(user);
        return jwt;
      }
    }
    
  }

}
