import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'
import { DoctorAppointmentsSummary } from 'src/database/entities/doctor-appointments-summary.entity'
import { Departament } from 'src/database/entities/departament.entity'
import { Week, getWeeksArray } from './util'

export interface AppointmentsAnalytics {
  topDoctor: TopDoctor
  currentPeriod: AppointmentsAnalyticsNode
  previosPeriod: AppointmentsAnalyticsNode
}

export interface TopDoctor {
  doctorId: number
  appointmentCount: number
  productivityGrowth: number
}

export interface AppointmentsAnalyticsNode {
  [key: string]: AppointmentsAnalyticsNode | DoctorAppointmentsSummary[]
}

export interface DoctorSummary {
  doctorId: number
  selectedAppointmentCount: number
  unSelectedAppointmentCount: number
}

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
    filterDepartamentIdsRaw: string
  ): Promise<AppointmentsAnalytics> {
    const fromDate = new Date(fromDateRaw)
    const toDate = new Date(toDateRaw)

    if (fromDate > toDate) {
      throw new BadRequestException('Invalid date period')
    }

    const filterDepartamentIds: number[] = filterDepartamentIdsRaw
      ? JSON.parse(filterDepartamentIdsRaw)
      : []

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
      topDoctor: this.findTopDoctor(summary, selectedWeeks),
      currentPeriod: this.wrapDepartamentsByWeeks(
        departaments,
        summary,
        selectedWeeks,
        isIncludeEmptyValues,
        filterDepartamentIds
      ),
      previosPeriod: this.wrapDepartamentsByWeeks(
        departaments,
        summary,
        previosWeeks,
        isIncludeEmptyValues,
        filterDepartamentIds
      ),
    }
  }

  findTopDoctor(
    summary: DoctorAppointmentsSummary[],
    selectedWeeks: Week[]
  ): TopDoctor {
    const doctors = this.getUniqueDoctorsSummary(summary)

    summary.forEach((element) => {
      const isSelected = selectedWeeks.some(
        (week) => week.weekNumber == element.weekNumber
      )
      const findedDoctor = doctors.find(
        (doctor) => doctor.doctorId == element.doctorId
      )
      if (isSelected) {
        findedDoctor.selectedAppointmentCount += element.appointmentCount
      } else {
        findedDoctor.unSelectedAppointmentCount += element.appointmentCount
      }
    })

    let appointmentCount = 0
    let topDoctor: DoctorSummary = null

    doctors.forEach((doctor) => {
      if (doctor.selectedAppointmentCount > appointmentCount) {
        appointmentCount = doctor.selectedAppointmentCount
        topDoctor = doctor
      }
    })

    if (!topDoctor) {
      return null
    }

    return {
      doctorId: topDoctor.doctorId,
      appointmentCount: topDoctor.selectedAppointmentCount,
      productivityGrowth:
        topDoctor.unSelectedAppointmentCount == 0
          ? null
          : Math.round(
              100 -
                (topDoctor.unSelectedAppointmentCount /
                  topDoctor.selectedAppointmentCount) *
                  100
            ),
    }
  }

  getUniqueDoctorsSummary(
    summary: DoctorAppointmentsSummary[]
  ): DoctorSummary[] {
    let doctors: DoctorSummary[] = []

    summary.forEach((element) => {
      const isIncluded = doctors.some(
        (doctor) => doctor.doctorId == element.doctorId
      )
      if (!isIncluded) {
        doctors.push({
          doctorId: element.doctorId,
          selectedAppointmentCount: 0,
          unSelectedAppointmentCount: 0,
        })
      }
    })

    return doctors
  }

  includeWeek(weeks: Week[], includeWeek: Week): boolean {
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
    isIncludeEmptyValues: boolean,
    filterDepartamentIds: number[]
  ): AppointmentsAnalyticsNode {
    const period = weeks.map((week) => {
      const key = `${week.year}-${week.month}:${week.weekNumberInMonth}`
      let value = this.wrapDepartements(
        departaments,
        summary.filter((element) => element.weekNumber == week.weekNumber),
        isIncludeEmptyValues,
        filterDepartamentIds
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
    isIncludeEmptyValues: boolean,
    filterDepartamentIds: number[]
  ): AppointmentsAnalyticsNode {
    const nodes: Departament[] = this.getNodesBFS(departaments)
    let wrappedNodes = {}

    nodes.reverse().forEach((node) => {
      if (node.children.length !== 0) {
        const wrapedChilderNodes = this.getWrapedChildrenNodes(
          node.children,
          wrappedNodes,
          filterDepartamentIds
        )

        if (
          Object.values(wrapedChilderNodes).length !== 0 &&
          this.isWrappedChildrenNotEmpty(wrapedChilderNodes)
        ) {
          wrappedNodes = {
            ...wrappedNodes,
            [node.name]: wrapedChilderNodes,
          }
          return
        }

        if (
          Object.values(wrapedChilderNodes).length !== 0 &&
          isIncludeEmptyValues
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

    return this.getWrapedChildrenNodes(
      departaments,
      wrappedNodes,
      filterDepartamentIds
    )
  }

  getNodesBFS(departaments: Departament[]): Departament[] {
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
  ): DoctorAppointmentsSummary[] | {} {
    const summaryByDepartament = summary.filter((element) =>
      element.departamentIds.includes(departament.id)
    )

    return summaryByDepartament ?? {}
  }

  getWrapedChildrenNodes(
    children: Departament[],
    wrappedNodes: any,
    filterDepartamentIds: number[]
  ): AppointmentsAnalyticsNode {
    let childrenWrappedNodes = {}

    children.forEach((child) => {
      if (
        filterDepartamentIds.length != 0 &&
        !filterDepartamentIds.includes(child.id)
      ) {
        return
      }

      childrenWrappedNodes = {
        ...childrenWrappedNodes,
        [child.name]: wrappedNodes[child.name],
      }
    })

    return childrenWrappedNodes
  }

  isWrappedChildrenNotEmpty(wrapedChildren: any): boolean {
    return Object.values(wrapedChildren).every((value) => {
      if (!value) {
        return true
      }

      return Object.keys(value).length !== 0
    })
  }
}
