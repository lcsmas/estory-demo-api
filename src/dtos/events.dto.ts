import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  public title: string;

  @MaxLength(280)
  @IsString()
  public description: string;

  @IsOptional()
  @IsNumber()
  public day: number;

  @IsOptional()
  @IsNumber()
  public month: number;

  @IsNumber()
  public year: bigint;

  @IsString()
  public img: string;

  @IsString()
  public img_offset: string;
}
