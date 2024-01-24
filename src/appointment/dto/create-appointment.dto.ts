import { IsISO8601, IsNumber } from 'class-validator'

export class CreateAppointmentDto {
  @IsNumber()
  public readonly patientId: number

  @IsNumber()
  public readonly doctorId: number

  @IsISO8601()
  public readonly startTime: string

  @IsISO8601()
  public readonly endTime: string
}
