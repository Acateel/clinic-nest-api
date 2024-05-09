import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateDepartamentDto {
  @IsString()
  name: string

  @IsOptional()
  @IsNumber()
  parentId: number
}
