import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Note } from './Note'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    password_hash: string;

    @OneToMany(type => Note, note => note.user)
    notes: Note[]
}