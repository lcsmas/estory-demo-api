import { IsString, MaxLength } from 'class-validator';

export class CreateMediaItemDto {
  @IsString()
  public title: string;

  @MaxLength(8192)
  @IsString()
  public link: string;

  @MaxLength(1000)
  @IsString()
  public img: string;

  @IsString()
  public type: string;

  @IsString()
  public service: string;
}
