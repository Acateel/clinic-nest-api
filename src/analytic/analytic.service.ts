import { Injectable } from '@nestjs/common'
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
    fromDate: string,
    toDate: string,
    filterDepartamentIds: string
  ) {
    const summary = await this.entityManager.find(DoctorAppointmentsSummary)

    const departaments = await this.entityManager
      .getTreeRepository(Departament)
      .findTrees()

    const allWeeks = getWeeksArray(
      summary[0].weekMinDate,
      summary[summary.length - 1].weekMinDate
    )

    const currentPeriod = allWeeks.map((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumberInMonth}`
      const value = this.wrapDepartements(
        departaments,
        summary.filter((element) => element.weekNumber == week.weekNumber)
      )

      return { [key]: value }
    })

    return {
      topDoctor: {},
      currentPeriod: Object.assign({}, ...currentPeriod),
      previosPeriod: {},
    }
  }

  wrapDepartements(
    departaments: Departament[],
    summary: DoctorAppointmentsSummary[]
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
