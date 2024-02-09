import {
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsOptional,
  IsString,
  Length,
} from 'class-validator'
import { UserRole } from '../../database/entities/user.entity'

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  public readonly email: string

  @IsOptional()
  @Length(4, 15)
  @IsMobilePhone()
  public readonly phoneNumber: string

  @IsString()
  public readonly password: string

  @IsEnum(UserRole)
  public readonly role: UserRole
}
