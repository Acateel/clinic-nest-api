import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { UserRole } from 'src/user/entities/user.entity'

export class LoginUserDto {
  @IsOptional()
  @IsEmail()
  public readonly email: string

  @IsOptional()
  @Length(4, 15)
  @IsMobilePhone()
  public readonly phoneNumber: string

  @IsOptional()
  @IsString()
  public readonly code: string

  @IsOptional()
  @IsEnum(UserRole)
  public readonly role: UserRole
}
