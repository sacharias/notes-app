import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  public: boolean;

  @Column()
  views: number;

  @ManyToOne(() => User, (user) => user.notes)
  user: User;
}
