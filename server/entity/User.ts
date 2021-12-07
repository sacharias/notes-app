import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password_hash: string;
}