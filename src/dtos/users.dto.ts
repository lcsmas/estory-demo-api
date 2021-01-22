import { IsString, IsEmail, IsBoolean, Length, MaxLength } from 'class-validator';

export class CreateUserDto {
  @Length(1, 20)
  @IsString()
  public lastname: string;

  @Length(1, 20)
  @IsString()
  public firstname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @MaxLength(250)
  @IsString()
  public ch_rand: string;

  @IsBoolean()
  public validated: boolean;

  @MaxLength(50)
  @IsString()
  public oauth_provider: string;

  @MaxLength(50)
  @IsString()
  public oauth_uid: string;

  @MaxLength(50)
  @IsString()
  public gender: string;

  @IsString()
  public picture: string;

  @MaxLength(280)
  @IsString()
  public description: string;

  @IsString()
  public validation_date: string;

  @IsString()
  public last_logged_date: string;
}

export class CreateSignupDto {
  @Length(1, 20)
  @IsString()
  public lastname: string;

  @Length(1, 20)
  @IsString()
  public firstname: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public gender: string;
}

export class CreateLoginDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
