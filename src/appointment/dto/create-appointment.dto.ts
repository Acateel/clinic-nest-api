import { Transform } from 'class-transformer'
import { IsNumber, IsDate } from 'class-validator'

export class CreateAppointmentDto {
  @IsNumber()
  public readonly patientId: number

  @IsNumber()
  public readonly doctorId: number

  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly startTime: Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly endTime: Date
}
