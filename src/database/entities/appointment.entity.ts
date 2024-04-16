import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Doctor } from './doctor.entity'
import { Patient } from './patient.entity'

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamptz' })
  startTime: Date

  @Column({ type: 'timestamptz' })
  endTime: Date

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
  })
  patient: Patient

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
