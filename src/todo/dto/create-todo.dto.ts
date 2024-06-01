import { ApiProperty } from "@nestjs/swagger";

export class CreateTodoDto {
    @ApiProperty({ example: 'Play game', description: 'The name of the todo' })
    name: string;

    @ApiProperty({ example: 'false', description: '' })
    isDone: boolean
}
