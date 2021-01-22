import { IsNumber } from 'class-validator';

export class createMediaTimelineDto {
  @IsNumber()
  public id_timeline: bigint;
  @IsNumber()
  public id_media: bigint;
}
