import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(   
  @InjectRepository(User)
  private readonly userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, username, ...userData } = createUserDto;
    const isUser = await this.userRepository.findOne({ where: [{email: userData.email }, {phone: userData.phone}] })
    if (isUser) {
      return null;
    }
    const hashedPassword = await bcrypt.hash(password+username, 10);

    const newUser = await this.userRepository.create({
      ...userData,
      username: username,
      password: hashedPassword,
    });
    console.log(newUser)
    return this.userRepository.save(newUser);
  }

  async authorizeByEmail(login: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: login } });
    if (user && await bcrypt.compare(password+user.username, user.password)) {
      return user;
    }
    return null;
  }

  async authorizeByPhone(login: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { phone: login } });
    if (user && await bcrypt.compare(password+user.username, user.password)) {
      return user;
    }
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.findOne({ where: {id: id} }).then(async (user: User) => {
      if (!user || user?.isDeactivate) {
       return null
      }

      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password + user.username, 10);
        updateUserDto.password = hashedPassword; 
      }
      console.log(updateUserDto)
      return this.userRepository.save({id: id, ...updateUserDto })
    });
  }

  deactivate(id: number) {
    return this.userRepository.update(id, {isDeactivate: true})
  }
}
