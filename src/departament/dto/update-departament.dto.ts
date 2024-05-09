import { IsNumber, IsOptional, IsString } from 'class-validator'

export class UpdateDepartamentDto {
  @IsOptional()
  @IsString()
  name: string

  @IsNumber({}, { each: true })
  doctorIds: number[]
}
