import { Injectable } from '@nestjs/common'
import { CreateDoctorDto } from './dto/create-doctor.dto'
import { UpdateDoctorDto } from './dto/update-doctor.dto'
import { Repository } from 'typeorm'
import { Doctor } from './entities/doctor.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepo: Repository<Doctor>
  ) {}

  async create({ firstName, lastName, specialty }: CreateDoctorDto) {
    const doctor = new Doctor()

    doctor.firstName = firstName
    doctor.lastName = lastName
    doctor.specialty = specialty

    const result = await this.doctorRepo.save(doctor)

    return result
  }

  async findAll(filter: any) {
    let doctorsQuery = this.doctorRepo
      .createQueryBuilder('doctor')
      .addSelect('count(appointment_entity.id)', 'app_count')
      .leftJoin('doctor.appointments', 'appointment_entity')
      .groupBy('doctor.id')
      .addOrderBy('app_count', 'DESC')

    if (filter.firstName) {
      doctorsQuery = doctorsQuery.andWhere('doctor.firstName = :firstName', {
        firstName: filter.firstName,
      })
    }

    if (filter.specialty) {
      doctorsQuery = doctorsQuery.andWhere('doctor.specialty = :specialty', {
        specialty: filter.specialty,
      })
    }

    if (filter.ids) {
      const parsedIds = JSON.parse(filter.ids)
      doctorsQuery = doctorsQuery.andWhere('doctor.id IN (:...ids)', {
        ids: parsedIds,
      })
    }

    if (filter.page && filter.pageSize) {
      doctorsQuery = doctorsQuery
        .skip((filter.page - 1) * filter.pageSize)
        .take(filter.pageSize)
    }

    const doctors: any[] = await doctorsQuery.getMany()

    return doctors
  }

  async findOne(id: number) {
    const doctor = await this.doctorRepo.findOneBy({ id })

    return doctor
  }

  async update(
    id: number,
    { firstName, lastName, specialty }: UpdateDoctorDto
  ) {
    const doctor = await this.doctorRepo.findOneBy({ id })

    doctor.firstName = firstName
    doctor.lastName = lastName
    doctor.specialty = specialty

    const result = await this.doctorRepo.save(doctor)

    return result
  }

  async remove(id: number) {
    const result = await this.doctorRepo.delete(id)

    return result
  }
}
