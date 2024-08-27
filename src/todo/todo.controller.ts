import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException, UseGuards, Request, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('todos')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('createTodo')
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodoDto })
  create(@Body() createTodoDto: CreateTodoDto, @Request() req) {
    return this.todoService.create(createTodoDto, req.user.id);
  }

  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    const data = await this.todoService.findAll(req.user.id, page, limit);
    if (!data) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return data
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('updateTodo/:id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.update(+id, updateTodoDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('deleteTodo/:id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
