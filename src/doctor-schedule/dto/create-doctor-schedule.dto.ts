import { Transform } from 'class-transformer'
import { IsDate } from 'class-validator'

export class CreateDoctorScheduleDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly startTime: Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  public readonly endTime: Date
}
