import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateDepartamentDto } from './dto/create-departament.dto'
import { UpdateDepartamentDto } from './dto/update-departament.dto'
import { DeleteResult, EntityManager, Repository } from 'typeorm'
import { Departament } from 'src/database/entities/departament.entity'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Doctor } from 'src/database/entities/doctor.entity'
import { WrapDepartament } from './util'

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private departamentRepo: Repository<Departament>,
    @InjectEntityManager()
    private entityMenager: EntityManager,
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>
  ) {}

  async create({ name, parentId }: CreateDepartamentDto): Promise<Departament> {
    const departament = new Departament()
    departament.name = name

    if (parentId) {
      const parent = await this.departamentRepo.findOneBy({ id: parentId })

      if (!parent) {
        throw new NotFoundException('Departament not found.')
      }

      departament.parent = parent
    }

    const result = this.departamentRepo.save(departament)

    return result
  }

  async findAll(): Promise<Departament[]> {
    const departamentTreeManager =
      this.entityMenager.getTreeRepository(Departament)

    const departaments = await departamentTreeManager.findTrees({
      relations: ['doctors'],
    })

    const wrapedDepartament = departaments.map((departament) =>
      WrapDepartament(departament)
    )

    return wrapedDepartament
  }

  async findOne(id: number): Promise<Departament> {
    const departamentTreeManager =
      this.entityMenager.getTreeRepository(Departament)

    const departament = await this.departamentRepo.findOneBy({ id })

    const departamentChildTree =
      await departamentTreeManager.findDescendantsTree(departament)

    const wrapedDepartament = WrapDepartament(departamentChildTree)

    return wrapedDepartament
  }

  async update(
    id: number,
    { name, doctorIds }: UpdateDepartamentDto
  ): Promise<Departament> {
    const departament = await this.departamentRepo.findOneBy({ id })

    if (!departament) {
      throw new NotFoundException('Departament not found.')
    }

    departament.name = name ?? departament.name

    const doctors = await this.doctorRepo
      .createQueryBuilder('doctor')
      .andWhere('doctor.id IN (:...ids)', {
        ids: doctorIds,
      })
      .getMany()

    departament.doctors = doctors

    const result = await this.departamentRepo.save(departament)

    return result
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.departamentRepo.delete(id)

    return result
  }
}
