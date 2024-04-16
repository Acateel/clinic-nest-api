import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Authcode } from './authcode.entity'
import { UserRole } from '../../common/user-role-enum'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    nullable: true,
    unique: true,
  })
  email: string

  @Column({
    nullable: true,
    length: 15,
    unique: true,
  })
  phoneNumber: string

  @Column({ select: false })
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.Patient,
  })
  role: UserRole

  @OneToMany(() => Authcode, (authcode) => authcode.user, {
    onDelete: 'CASCADE',
  })
  Authcodes: Authcode[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
