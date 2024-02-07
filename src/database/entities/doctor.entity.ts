import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Appointment } from 'src/database/entities/appointment.entity'
import { DoctorSchedule } from 'src/database/entities/doctor-schedule.entity'

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({
    default: 'general',
  })
  specialty: string

  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    onDelete: 'CASCADE',
  })
  appointments: Appointment[]

  @OneToMany(() => DoctorSchedule, (doctorSchedule) => doctorSchedule.doctor, {
    onDelete: 'CASCADE',
  })
  schedule: DoctorSchedule[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
