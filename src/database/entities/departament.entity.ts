import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm'
import { Doctor } from './doctor.entity'

@Entity()
@Tree('closure-table')
export class Departament {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Doctor, (doctor) => doctor.departaments, {
    onDelete: 'CASCADE',
  })
  doctors: Doctor[]

  @TreeParent({ onDelete: 'CASCADE' })
  parent: Departament

  @TreeChildren()
  children: Departament[]

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date
}
