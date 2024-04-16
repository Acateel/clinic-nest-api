import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Appointment } from './appointment.entity'

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({
    nullable: true,
    length: 15,
    unique: true,
  })
  phoneNumber: string

  @OneToMany(() => Appointment, (appointment) => appointment.patient, {
    onDelete: 'CASCADE',
  })
  appointments: Appointment[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
