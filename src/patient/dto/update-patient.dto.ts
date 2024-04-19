import { Transform } from 'class-transformer'
import { IsMobilePhone, IsOptional, IsString, Length } from 'class-validator'
import { formatPhoneNumber } from 'src/common/format-phone-number'

export class UpdatePatientDto {
  @IsString()
  public readonly firstName: string

  @IsString()
  public readonly lastName: string

  @IsOptional()
  @Length(4, 15)
  @IsMobilePhone()
  @Transform(({ value }) => formatPhoneNumber(value))
  public readonly phoneNumber?: string
}
