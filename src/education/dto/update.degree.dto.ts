import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDegreeDto {
  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value === 'true' || value === '1';
    }
    return Boolean(value);
  })
  @IsBoolean()
  finished?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ obj, value }) => {
    if (obj.finished === false) return null;
    return value ? new Date(value) : undefined;
  })
  endDate?: Date | null;
}
