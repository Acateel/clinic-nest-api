import { Injectable } from '@nestjs/common'
import { CreatePatientDto } from './dto/create-patient.dto'
import { UpdatePatientDto } from './dto/update-patient.dto'
import { DeleteResult, Repository } from 'typeorm'
import { Patient } from '../database/entities/patient.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { formatPhoneNumber } from 'src/common/format-phone-number'

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>
  ) {}

  async create({
    firstName,
    lastName,
    phoneNumber,
  }: CreatePatientDto): Promise<Patient> {
    const patient = new Patient()

    patient.firstName = firstName
    patient.lastName = lastName
    patient.phoneNumber = formatPhoneNumber(phoneNumber)

    const result = await this.patientRepo.save(patient)

    return result
  }

  async findAll(filter: any): Promise<Patient[]> {
    let patientQuery = this.patientRepo.createQueryBuilder('patient')

    if (filter.firstName) {
      patientQuery = patientQuery.andWhere('patient.firstName = :firstName', {
        firstName: filter.firstName,
      })
    }

    const formatedPhoneNumber = formatPhoneNumber(filter.phoneNumber)
    if (formatedPhoneNumber) {
      patientQuery = patientQuery.andWhere(
        'patient.phoneNumber = :phoneNumber',
        {
          phoneNumber: formatedPhoneNumber,
        }
      )
    }

    const patients = await patientQuery.getMany()

    return patients
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ id })

    return patient
  }

  async update(
    id: number,
    { firstName, lastName, phoneNumber }: UpdatePatientDto
  ): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ id })

    patient.firstName = firstName ?? patient.firstName
    patient.lastName = lastName ?? patient.lastName
    patient.phoneNumber = formatPhoneNumber(phoneNumber) ?? patient.phoneNumber

    const result = await this.patientRepo.save(patient)

    return result
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.patientRepo.delete(id)

    return result
  }
}
