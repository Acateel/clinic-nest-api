import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
export class Departament {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Doctor, (doctor) => doctor.departaments, {
    onDelete: 'CASCADE',
  })
  doctors: Doctor[]

  @ManyToOne(() => Departament, (departament) => departament.children, {
    onDelete: 'CASCADE',
  })
  parent: Departament

  @OneToMany(() => Departament, (departament) => departament.parent, {
    onDelete: 'CASCADE',
  })
  children: Departament[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
