import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GenerateCvDto {
  @ApiPropertyOptional({ description: 'ID del usuario' })
  @IsOptional({ message: 'El campo userId es obligatorio' })
  userId: string;

  @ApiProperty({ description: 'Numero del template a utilizar' })
  @IsNotEmpty({ message: 'El campo es obligatorio ej 1,2,3 los templates pueden estar sujetos a cambios o eliminacion.' })
  templateId: string;

  @ApiPropertyOptional({
    description: 'IDs de los proyectos seleccionados',
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'projectsIds debe ser un arreglo' })
  @ArrayNotEmpty({
    message: 'projectsIds no puede estar vacío si se proporciona',
  })
  @Type(() => Number)
  projectsIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de las habilidades seleccionadas',
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'skillsIds debe ser un arreglo' })
  @ArrayNotEmpty({
    message: 'skillsIds no puede estar vacío si se proporciona',
  })
  @Type(() => Number)
  skillsIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de los idiomas seleccionados',
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'languagesIds debe ser un arreglo' })
  @ArrayNotEmpty({
    message: 'languagesIds no puede estar vacío si se proporciona',
  })
  @Type(() => Number)
  languagesIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de la educación seleccionada',
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'educationIds debe ser un arreglo' })
  @ArrayNotEmpty({
    message: 'educationIds no puede estar vacío si se proporciona',
  })
  @Type(() => Number)
  educationIds?: number[];

  @ApiPropertyOptional({
    description: 'IDs de la experiencia seleccionada',
    type: [Number],
  })
  @IsOptional()
  @IsArray({ message: 'experienceIds debe ser un arreglo' })
  @ArrayNotEmpty({
    message: 'experienceIds no puede estar vacío si se proporciona',
  })
  @Type(() => Number)
  experienceIds?: number[];
}
