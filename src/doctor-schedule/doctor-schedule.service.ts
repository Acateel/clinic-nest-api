import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common'
import { CreateDoctorScheduleDto } from './dto/create-doctor-schedule.dto'
import { UpdateDoctorScheduleDto } from './dto/update-doctor-schedule.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DoctorSchedule } from './entities/doctor-schedule.entity'
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { AppointmentService } from 'src/appointment/appointment.service'
import { DoctorService } from 'src/doctor/doctor.service'

@Injectable()
export class DoctorScheduleService {
  constructor(
    @InjectRepository(DoctorSchedule)
    private scheduleRepo: Repository<DoctorSchedule>,
    @Inject(forwardRef(() => AppointmentService))
    private appointmentService: AppointmentService,
    private doctorService: DoctorService
  ) {}

  async create(
    doctorId: number,
    createDoctorScheduleDto: CreateDoctorScheduleDto
  ) {
    const startTime = new Date(createDoctorScheduleDto.startTime)
    const endTime = new Date(createDoctorScheduleDto.endTime)
    this.throwIfBadDate(startTime, endTime)

    const doctor = await this.doctorService.findOne(doctorId)
    if (!doctor) {
      throw new NotFoundException('Doctor with doctorId dont found')
    }

    const schedule = new DoctorSchedule()
    schedule.doctor = doctor
    schedule.startTime = startTime
    schedule.endTime = endTime

    const result = await this.scheduleRepo.save(schedule)
    return result
  }

  async findAll() {
    const schedules = await this.scheduleRepo.find()

    return schedules
  }

  async findByDoctorId(doctorId) {
    const schedules = await this.scheduleRepo.findBy({
      doctor: { id: doctorId },
    })

    return schedules
  }

  async findOne(id: number) {
    const schedule = await this.scheduleRepo.findOneBy({ id })

    return schedule
  }

  async update(
    id: number,
    doctorId: number,
    updateDoctorScheduleDto: UpdateDoctorScheduleDto
  ) {
    const startTime = new Date(updateDoctorScheduleDto.startTime)
    const endTime = new Date(updateDoctorScheduleDto.endTime)
    this.throwIfBadDate(startTime, endTime)

    const doctor = await this.doctorService.findOne(doctorId)
    if (!doctor) {
      throw new NotFoundException('Doctor with doctorId dont found')
    }

    const schedule = await this.scheduleRepo.findOne({
      where: {
        id,
      },
      relations: {
        doctor: true,
      },
    })

    const isNewScheduleCorrect = await this.isNewScheduleIncludeAppointments(
      schedule,
      startTime,
      endTime
    )

    if (!isNewScheduleCorrect) {
      throw new BadRequestException(
        'Cannot update schedule, didnt include appointments'
      )
    }

    schedule.doctor = doctor
    schedule.startTime = startTime
    schedule.endTime = endTime

    const result = await this.scheduleRepo.save(schedule)
    return result
  }

  async remove(id: number) {
    const result = this.scheduleRepo.delete(id)

    return result
  }

  async isNewScheduleIncludeAppointments(
    oldSchedule: DoctorSchedule,
    newStartTime: Date,
    newEndTime: Date
  ) {
    const appointments = await this.appointmentService.findByDoctorSchedule(
      oldSchedule.doctor.id,
      oldSchedule.startTime,
      oldSchedule.endTime
    )

    const newScheduleIncludeAppointments = appointments.every(
      (appointment) =>
        appointment.startTime >= newStartTime &&
        appointment.endTime <= newEndTime
    )

    return newScheduleIncludeAppointments
  }

  async isTimesInSchedule(doctorId: number, startTime: Date, endTime: Date) {
    const schedule = await this.scheduleRepo.findOneBy({
      doctor: {
        id: doctorId,
      },
      startTime: LessThanOrEqual(startTime),
      endTime: MoreThanOrEqual(endTime),
    })
    if (schedule) {
      return true
    }
    return false
  }

  throwIfBadDate(startTime: Date, endTime: Date) {
    if (startTime > endTime) {
      throw new BadRequestException('Start time cannot be after end time')
    }

    if (startTime.toISOString() === endTime.toISOString()) {
      throw new BadRequestException(
        'Start and end times connot be one the same'
      )
    }
  }
}
