import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { DoctorAppointmentsSummary } from 'src/database/entities/doctor-appointments-summary.entity'
import { Departament } from 'src/database/entities/departament.entity'
import { Week, getWeeksArray } from './util'

@Injectable()
export class AnalyticService {
  constructor(
    @InjectEntityManager()
    private entityManager: EntityManager
  ) {}

  async comptuteAppointmentsAnalytics(
    isIncludeEmptyValues: boolean,
    fromDateRaw: string,
    toDateRaw: string,
    filterDepartamentIds: string
  ) {
    const fromDate = new Date(fromDateRaw)
    const toDate = new Date(toDateRaw)

    if (fromDate > toDate) {
      throw new BadRequestException('Invalid date period')
    }

    const summary = await this.entityManager.find(DoctorAppointmentsSummary)

    const departaments = await this.entityManager
      .getTreeRepository(Departament)
      .findTrees()

    const allWeeks = getWeeksArray(
      summary[0].weekMinDate,
      summary[summary.length - 1].weekMinDate
    )

    let selectedWeeks = getWeeksArray(fromDate, toDate)

    if (selectedWeeks.length == 0) {
      selectedWeeks = allWeeks
    }

    const previosWeeks = allWeeks.filter((week) => {
      return !this.includeWeek(selectedWeeks, week)
    })

    return {
      topDoctor: {},
      currentPeriod: this.wrapDepartamentsByWeeks(
        departaments,
        summary,
        selectedWeeks,
        isIncludeEmptyValues
      ),
      previosPeriod: this.wrapDepartamentsByWeeks(
        departaments,
        summary,
        previosWeeks,
        isIncludeEmptyValues
      ),
    }
  }

  includeWeek(weeks: Week[], includeWeek: Week) {
    for (let i = 0; i < weeks.length; i++) {
      if (
        weeks[i].year == includeWeek.year &&
        weeks[i].weekNumber == includeWeek.weekNumber
      ) {
        return true
      }
    }
    return false
  }

  wrapDepartamentsByWeeks(
    departaments: Departament[],
    summary: DoctorAppointmentsSummary[],
    weeks: Week[],
    isIncludeEmptyValues: boolean
  ) {
    const period = weeks.map((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumberInMonth}`
      let value = this.wrapDepartements(
        departaments,
        summary.filter((element) => element.weekNumber == week.weekNumber),
        isIncludeEmptyValues
      )

      if (!this.isWrappedChildrenNotEmpty(value) && !isIncludeEmptyValues) {
        return null
      }

      return { [key]: value }
    })

    return Object.assign({}, ...period)
  }

  wrapDepartements(
    departaments: Departament[],
    summary: DoctorAppointmentsSummary[],
    isIncludeEmptyValues: boolean
  ) {
    const nodes: Departament[] = this.getNodesBFS(departaments)
    let wrappedNodes = {}

    nodes.reverse().forEach((node) => {
      if (node.children.length !== 0) {
        const wrapedChilderNodes = this.getWrapedChildrenNodes(
          node.children,
          wrappedNodes
        )

        if (
          Object.keys(wrapedChilderNodes).length !== 0 &&
          this.isWrappedChildrenNotEmpty(wrapedChilderNodes)
        ) {
          wrappedNodes = {
            ...wrappedNodes,
            [node.name]: wrapedChilderNodes,
          }
          return
        }

        if (isIncludeEmptyValues) {
          wrappedNodes = {
            ...wrappedNodes,
            [node.name]: wrapedChilderNodes,
          }
          return
        }
      }

      wrappedNodes = {
        ...wrappedNodes,
        [node.name]: this.wrapDoctorsSummary(node, summary),
      }
    })

    return this.getWrapedChildrenNodes(departaments, wrappedNodes)
  }

  getNodesBFS(departaments: Departament[]) {
    let nodes: Departament[] = []

    departaments.forEach((departament) => nodes.push(departament))

    let index = 0
    while (index < nodes.length) {
      nodes[index]?.children?.forEach((child) => nodes.push(child))
      index++
    }

    return nodes
  }

  wrapDoctorsSummary(
    departament: Departament,
    summary: DoctorAppointmentsSummary[]
  ) {
    const summaryByDepartament = summary.filter((element) =>
      element.departamentIds.includes(departament.id)
    )

    return summaryByDepartament ?? {}
  }

  getWrapedChildrenNodes(children: Departament[], wrappedNodes: any) {
    let childrenWrappedNodes = {}

    children.forEach((child) => {
      childrenWrappedNodes = {
        ...childrenWrappedNodes,
        [child.name]: wrappedNodes[child.name],
      }
    })

    return childrenWrappedNodes
  }

  isWrappedChildrenNotEmpty(wrapedChildren: any) {
    return Object.values(wrapedChildren).every(
      (value) => Object.keys(value).length !== 0
    )
  }
}
