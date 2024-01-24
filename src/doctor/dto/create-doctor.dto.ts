import { IsOptional, IsString } from 'class-validator'

export class CreateDoctorDto {
  @IsString()
  public readonly firstName: string
  @IsString()
  public readonly lastName: string

  @IsOptional()
  @IsString()
  public readonly specialty: string
}
