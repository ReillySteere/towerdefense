import { IsString, IsInt, Min } from 'class-validator';

export class CreateEnemyDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  health: number;
}
