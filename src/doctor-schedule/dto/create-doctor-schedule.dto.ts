import { IsISO8601 } from 'class-validator'

export class CreateDoctorScheduleDto {
  @IsISO8601()
  public readonly startTime: string

  @IsISO8601()
  public readonly endTime: string
}
