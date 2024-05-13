import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Departament } from 'src/database/entities/departament.entity'
import { EntityManager } from 'typeorm'
import {
  findStartEndDate,
  getMonthWeekFirstDay,
  getMonthWeekLastDay,
  getTimePeriod,
  getWeeksArray,
  wrapDepartaments,
} from './util'

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

    const timePeriod = findStartEndDate(departaments)

    const weeks = getWeeksArray(timePeriod)

    const result = weeks.map((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumber}`
      const field = wrapDepartaments(departaments, week)

      return { [key]: field }
    })

    return {
      curentPeriod: Object.assign({}, ...result),
    }
  }
}
