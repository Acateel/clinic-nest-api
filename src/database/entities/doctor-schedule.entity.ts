import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class DoctorSchedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'timestamptz' })
  startTime: Date

  @Column({ type: 'timestamptz' })
  endTime: Date

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, {
    onDelete: 'CASCADE',
  })
  doctor: Doctor

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
