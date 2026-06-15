import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  // unique: true — ім'я тега має бути унікальним у межах таблиці
  @Column({ length: 50, unique: true })
  name: string;
}
