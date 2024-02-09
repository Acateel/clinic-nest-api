import { IsMobilePhone, IsOptional, IsString, Length } from 'class-validator'

export class UpdatePatientDto {
  @IsString()
  public readonly firstName: string

  @IsString()
  public readonly lastName: string

  @IsOptional()
  @Length(4, 15)
  @IsMobilePhone()
  public readonly phoneNumber?: string
}
