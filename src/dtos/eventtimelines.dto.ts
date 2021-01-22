import { IsNumber } from 'class-validator';

export class CreateEventTimelineDto {
  @IsNumber()
  public id_event: bigint;

  @IsNumber()
  public id_timeline: bigint;
}
