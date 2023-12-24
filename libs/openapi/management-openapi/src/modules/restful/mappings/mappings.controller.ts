import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

@ApiTags('mappings')
@Controller('/mappings')
export class MappingsController {}
