import { User } from 'src/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm'

@Entity()
export class Authcode {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @ManyToOne(() => User, (user) => user.Authcodes, {
    onDelete: 'CASCADE',
  })
  user: User

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
