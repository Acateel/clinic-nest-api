export interface DoctorAppointmentsSummary {
  summaryId: number

  doctorId: number

  fullName: string

  departamentIds: number[]

  appointmentCount: number

  weekNumber: number

  weekMinDate: Date
}

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
