import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { Departament } from 'src/database/entities/departament.entity'
import { EntityManager } from 'typeorm'
import {
  TimePeriod,
  findStartEndDate,
  getWeeksArray,
  wrapDepartaments,
} from './util'

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectEntityManager()
    private entityMenager: EntityManager
  ) {}

  async comptuteAppointmentsAnalytics(
    isIncludeEmptyValues: boolean,
    selectedPeriod: TimePeriod,
    filterDepartamentIds: number[]
  ) {
    if (selectedPeriod.endTime < selectedPeriod.startTime) {
      throw new BadRequestException('From Date bigger than to Date')
    }

    const departamentTreeManager =
      this.entityMenager.getTreeRepository(Departament)

    const departaments = await departamentTreeManager.findTrees({
      relations: ['doctors', 'doctors.appointments'],
    })

    let selectedWeeks = getWeeksArray(selectedPeriod)

    const timePeriod = findStartEndDate(departaments)
    const weeks = getWeeksArray(timePeriod)

    const result = {
      curentPeriod: [],
      previosPeriod: [],
    }

    if (selectedWeeks.length == 0) {
      selectedWeeks = weeks
    }

    selectedWeeks.forEach((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumber}`
      const field = wrapDepartaments(
        departaments,
        week,
        isIncludeEmptyValues,
        filterDepartamentIds
      )

      if (Object.keys(field).length == 0 && !isIncludeEmptyValues) {
        return
      }

      result.curentPeriod.push({ [key]: field })
    })

    result.curentPeriod = Object.assign({}, ...result.curentPeriod)

    weeks.forEach((week) => {
      const collitionWeek = selectedWeeks.find(
        (element) =>
          week.year == element.year &&
          week.month == element.month &&
          week.weekNumber == element.weekNumber
      )
      if (collitionWeek) {
        return
      }

      const key = `${week.year}-${week.month}:${week.weekNumber}`

      const field = wrapDepartaments(
        departaments,
        week,
        isIncludeEmptyValues,
        filterDepartamentIds
      )

      if (Object.keys(field).length == 0 && !isIncludeEmptyValues) {
        return
      }

      result.previosPeriod.push({ [key]: field })
    })

    result.previosPeriod = Object.assign({}, ...result.previosPeriod)

    return result
  }
}
