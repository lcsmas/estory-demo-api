import { IsOptional, IsString } from 'class-validator';

export class CreateTimelineDto {
  @IsString()
  public title: string;

  @IsString()
  public category: string;

  @IsString()
  public img_background: string;

  public step: number;

  @IsOptional()
  public status: string;
}
