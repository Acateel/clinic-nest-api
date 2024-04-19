import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { formatPhoneNumber } from 'src/common/format-phone-number'
import { UserRole } from 'src/common/user-role-enum'

export class LoginUserDto {
  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => new String(value).toLowerCase().trim())
  public readonly email: string

  @IsOptional()
  @Length(4, 15)
  @IsMobilePhone()
  @Transform(({ value }) => formatPhoneNumber(value))
  public readonly phoneNumber: string

  @IsOptional()
  @IsString()
  public readonly code: string

  @IsOptional()
  @IsEnum(UserRole)
  public readonly role: UserRole
}
