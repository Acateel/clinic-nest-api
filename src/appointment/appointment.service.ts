import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentDto } from './dto/update-appointment.dto'
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { Appointment } from '../database/entities/appointment.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DoctorScheduleService } from 'src/doctor-schedule/doctor-schedule.service'
import { PatientService } from 'src/patient/patient.service'
import { DoctorService } from 'src/doctor/doctor.service'

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @Inject(forwardRef(() => DoctorScheduleService))
    private doctorScheduleService: DoctorScheduleService,
    private patientService: PatientService,
    private doctorService: DoctorService
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const startTime = new Date(createAppointmentDto.startTime)
    const endTime = new Date(createAppointmentDto.endTime)
    const { doctorId, patientId } = createAppointmentDto

    this.throwIfBadDate(startTime, endTime)

    const patient = await this.patientService.findOne(patientId)
    if (!patient) {
      throw new NotFoundException('Patient with patientId dont found')
    }

    const doctor = await this.doctorService.findOne(doctorId)
    if (!doctor) {
      throw new NotFoundException('Doctor with doctorId dont found')
    }

    const isTimesInDoctorSchedules =
      await this.doctorScheduleService.isTimesInSchedule(
        doctorId,
        startTime,
        endTime
      )
    if (!isTimesInDoctorSchedules) {
      throw new BadRequestException('This time out of doctor schedule')
    }

    const canAddNewAppointment = await this.checkForCreate(
      doctorId,
      startTime,
      endTime
    )
    if (!canAddNewAppointment) {
      throw new BadRequestException('Cannot add appointment in this time')
    }

    const appointment = new Appointment()
    appointment.patient = patient
    appointment.doctor = doctor
    appointment.startTime = startTime
    appointment.endTime = endTime

    const result = await this.appointmentRepo.save(appointment)

    return result
  }

  async findAll() {
    const appointments = await this.appointmentRepo.find()

    return appointments
  }

  async findByDoctorSchedule(doctorId: number, startTime: Date, endTime: Date) {
    const appointmentsBySchedule = await this.appointmentRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
        startTime: MoreThanOrEqual(startTime),
        endTime: LessThanOrEqual(endTime),
      },
    })

    return appointmentsBySchedule
  }

  async findByDoctorIdAndDay(doctorId: number, date: Date) {
    const startOfDay = new Date(
      `${date.toISOString().split('T')[0]}T00:00:00.000Z`
    )
    const endOfDay = new Date(
      `${date.toISOString().split('T')[0]}T23:59:59.999Z`
    )

    const appointmentsByDay = await this.appointmentRepo.find({
      where: {
        doctor: {
          id: doctorId,
        },
        startTime: Between(startOfDay, endOfDay),
      },
      order: {
        startTime: 'ASC',
      },
    })

    return appointmentsByDay
  }

  async findOne(id: number) {
    const appointment = await this.appointmentRepo.findOneBy({ id })

    return appointment
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    const startTime = new Date(updateAppointmentDto.startTime)
    const endTime = new Date(updateAppointmentDto.endTime)
    const doctorId = updateAppointmentDto.doctorId

    this.throwIfBadDate(startTime, endTime)

    const appointment = await this.appointmentRepo.findOneBy({ id })

    const doctor = await this.doctorService.findOne(doctorId)
    if (!doctor) {
      throw new NotFoundException('Doctor with doctorId dont found')
    }

    const isTimesInDoctorSchedules =
      await this.doctorScheduleService.isTimesInSchedule(
        doctorId,
        startTime,
        endTime
      )
    if (!isTimesInDoctorSchedules) {
      throw new BadRequestException('This time out of doctor schedule')
    }

    const canUpdateAppointment = await this.checkForUpdate(
      id,
      doctorId,
      startTime,
      endTime
    )
    if (!canUpdateAppointment) {
      throw new BadRequestException('Cannot update appointment in this time')
    }

    appointment.doctor = doctor
    appointment.startTime = startTime
    appointment.endTime = endTime

    const result = await this.appointmentRepo.save(appointment)

    return result
  }

  async remove(id: number) {
    const result = await this.appointmentRepo.delete(id)

    return result
  }

  async checkForCreate(doctorId: number, startTime: Date, endTime: Date) {
    const appointmentsByDay = await this.findByDoctorIdAndDay(
      doctorId,
      startTime
    )
    const canAddNewAppointment = this.checkAppoitmentTimes(
      appointmentsByDay,
      startTime,
      endTime
    )
    return canAddNewAppointment
  }

  async checkForUpdate(
    appointmentId: number,
    doctorId: number,
    startTime: Date,
    endTime: Date
  ) {
    const appointmentsByDay = await this.findByDoctorIdAndDay(
      doctorId,
      startTime
    )
    const appointmentsByDayWitoutOne = appointmentsByDay.filter(
      (appointment) => appointment.id !== appointmentId
    )
    const canUpdateAppointment = this.checkAppoitmentTimes(
      appointmentsByDayWitoutOne,
      startTime,
      endTime
    )
    return canUpdateAppointment
  }

  checkAppoitmentTimes(
    appointmentsByDay: Appointment[],
    startTime: Date,
    endTime: Date
  ) {
    if (
      appointmentsByDay.length === 0 ||
      endTime <= appointmentsByDay[0].startTime ||
      startTime >= appointmentsByDay[appointmentsByDay.length - 1].endTime
    ) {
      return true
    }

    for (let i = 0; i < appointmentsByDay.length - 1; i++) {
      if (
        startTime >= appointmentsByDay[i].endTime &&
        endTime <= appointmentsByDay[i + 1].startTime
      ) {
        return true
      }
    }

    return false
  }

  throwIfBadDate(startTime: Date, endTime: Date) {
    const now = new Date()

    if (startTime < now) {
      throw new BadRequestException('Start time cannot be in past')
    }

    if (startTime > endTime) {
      throw new BadRequestException('Start time cannot be after end time')
    }

    if (startTime.toISOString() === endTime.toISOString()) {
      throw new BadRequestException(
        'Start and end times connot be one the same'
      )
    }

    if (startTime.toDateString() !== endTime.toDateString()) {
      throw new BadRequestException(
        'Start and end times connot be in different days'
      )
    }
  }
}
