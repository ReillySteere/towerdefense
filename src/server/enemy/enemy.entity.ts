import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Enemy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  health: number;
}
