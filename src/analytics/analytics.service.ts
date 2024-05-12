import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Departament } from 'src/database/entities/departament.entity'
import { EntityManager } from 'typeorm'
import { deleteDates, findStartEndDate, wrapDepartaments } from './util'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectEntityManager()
    private entityMenager: EntityManager
  ) {}

  async comptuteAppointmentsAnalytics() {
    const departamentTreeManager =
      this.entityMenager.getTreeRepository(Departament)

    const departaments = await departamentTreeManager.findTrees({
      relations: ['doctors', 'doctors.appointments'],
    })

    return wrapDepartaments(departaments)
  }
}
