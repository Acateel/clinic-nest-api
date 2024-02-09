import { Transform } from 'class-transformer'
import { IsDate, IsNumber } from 'class-validator'

export class UpdateAppointmentDto {
  @IsNumber()
  public readonly doctorId: number

  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly startTime: Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly endTime: Date
}
