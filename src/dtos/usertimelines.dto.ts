import { IsNumber } from 'class-validator';

export class CreateUserTimelineDto {
  @IsNumber()
  public id_user: number;

  @IsNumber()
  public id_timeline: bigint;
}
