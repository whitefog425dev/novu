import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Branding {
  @ApiPropertyOptional()
  fontFamily?: string;
  @ApiPropertyOptional()
  fontColor?: string;
  @ApiPropertyOptional()
  contentBackground?: string;
  @ApiProperty()
  logo: string;
  @ApiProperty()
  color: string;
  @ApiPropertyOptional({
    enum: ['ltr', 'rtl'],
  })
  direction?: 'ltr' | 'rtl';
}

export class OrganizationResponseDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  branding: Branding;
}
