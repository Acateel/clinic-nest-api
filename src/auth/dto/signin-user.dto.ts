import { IsString } from 'class-validator'

export class SigninUserDto {
  @IsString()
  public readonly login: string

  @IsString()
  public readonly password: string
}
