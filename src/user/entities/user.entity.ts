import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    email: string

    @Column({nullable: true})
    phone: string

    @Column()
    username: string

    @Column()
    password: string

    @Column({default: false})
    isDeactivate: boolean

    @BeforeInsert()
    @BeforeUpdate()
    validateEmailOrPhone() {
        if (!this.email && !this.phone) {
            throw new Error("Either email or phone must be provided.");
        }
    }
}
