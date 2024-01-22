import { Doctor } from 'src/doctor/entities/doctor.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

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
