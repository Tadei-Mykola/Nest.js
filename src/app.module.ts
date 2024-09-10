import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Todo } from './todo/entities/todo.entity';
import { environment } from 'environment';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.dataBase.host,
      port: environment.dataBase.port,
      username: environment.dataBase.username,
      password: environment.dataBase.password,
      database: environment.dataBase.database,
      entities: [User, Todo],
      synchronize: true,
    }),
    UserModule, 
    TodoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
