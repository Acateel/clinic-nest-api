import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Departament } from 'src/database/entities/departament.entity'
import { EntityManager } from 'typeorm'
import { findStartEndDate, getWeeksArray, wrapDepartaments } from './util'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectEntityManager()
    private entityMenager: EntityManager
  ) {}

  async comptuteAppointmentsAnalytics(isIncludeEmptyValues: boolean) {
    const departamentTreeManager =
      this.entityMenager.getTreeRepository(Departament)

    const departaments = await departamentTreeManager.findTrees({
      relations: ['doctors', 'doctors.appointments'],
    })

    const timePeriod = findStartEndDate(departaments)

    const weeks = getWeeksArray(timePeriod)

    const result = {
      curentPeriod: [],
      previosPeriod: [],
    }

    weeks.forEach((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumber}`
      const field = wrapDepartaments(departaments, week, isIncludeEmptyValues)

      if (Object.keys(field).length == 0 && !isIncludeEmptyValues) {
        return
      }

      result.curentPeriod.push({ [key]: field })
    })

    result.curentPeriod = Object.assign({}, ...result.curentPeriod)
    result.previosPeriod = Object.assign({}, ...result.previosPeriod)

    return result
  }
}
