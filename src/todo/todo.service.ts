import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto, userId: number) {
    const todo = new Todo();
    todo.name = createTodoDto.name;
    todo.isDone = createTodoDto.isDone;
    todo.userId = userId;
    return this.todoRepository.save(todo);
  }

  
  async findAll(userId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const todos = await this.todoRepository.find({ where: {userId}, skip, take: limit });
    const total = await this.todoRepository.count({where: {userId}});
    return {
      todos,
      hasMore: total > skip + limit,
    };
  }

  async update (id: number, updateTodoDto: UpdateTodoDto) {
    await this.todoRepository.update(id, updateTodoDto)
    return this.todoRepository.findOneBy({id});
  }

  remove(id: number) {
    return this.todoRepository.delete(id);
  }
}
