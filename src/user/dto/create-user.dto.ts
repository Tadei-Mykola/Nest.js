import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ example: 'tmukola2006@gmail.com', description: '' })
    email: string;

    @ApiProperty({ example: '+3809822052592', description: '' })
    phone: string;

    @ApiProperty({ example: 'TM', description: '' })
    username: string;

    @ApiProperty({ example: 'Tm2611', description: '' })
    password: string;

}
