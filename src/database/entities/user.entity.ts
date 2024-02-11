import { Authcode } from 'src/database/entities/authcode.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

export enum UserRole {
  Doctor = 'doctor',
  Patient = 'patient',
  Admin = 'admin',
}

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
