import { Injectable } from '@nestjs/common'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { Repository } from 'typeorm'
import { Patient } from './entities/patient.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { formatPhoneNumber } from 'src/util/format-phone-number'

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>
  ) {}

  async create({ firstName, lastName, phoneNumber }: CreatePatientDto) {
    const patient = new Patient()

    patient.firstName = firstName
    patient.lastName = lastName
    patient.phoneNumber = formatPhoneNumber(phoneNumber)

    const result = await this.patientRepo.save(patient)

    return result
  }

  async findAll() {
    const patients = await this.patientRepo.find()

    return patients
  }

  async findOne(id: number) {
    const patient = await this.patientRepo.findOneBy({ id })

    return patient
  }

  async update(
    id: number,
    { firstName, lastName, phoneNumber }: UpdatePatientDto
  ) {
    const patient = await this.patientRepo.findOneBy({ id })

    patient.firstName = firstName
    patient.lastName = lastName
    patient.phoneNumber = formatPhoneNumber(phoneNumber)

    const result = await this.patientRepo.save(patient)

    return result
  }

  async remove(id: number) {
    const result = await this.patientRepo.delete(id)

    return result
  }
}
