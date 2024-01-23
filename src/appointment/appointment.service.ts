import { Injectable } from '@nestjs/common'
import { CreateAppointmentDto } from './dto/create-appointment.dto'
import { UpdateAppointmentDto } from './dto/update-appointment.dto'
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm'
import { Appointment } from './entities/appointment.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>
  ) {}

  create(createAppointmentDto: CreateAppointmentDto) {
    return 'This action adds a new appointment'
  }

  findAll() {
    return `This action returns all appointment`
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

  findOne(id: number) {
    return `This action returns a #${id} appointment`
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`
  }
}
