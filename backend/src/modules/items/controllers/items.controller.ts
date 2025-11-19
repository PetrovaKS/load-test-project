import { Controller, Get, Query } from '@nestjs/common';
import { ItemsService } from '../services/items.service';
import { GetItemsDto } from '../dto/get-items.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(@Query() getItemsDto: GetItemsDto) {
    return this.itemsService.findAll(getItemsDto);
  }

  @Get('cached')
  async findAllCached(@Query() getItemsDto: GetItemsDto) {
    return this.itemsService.findAllCached(getItemsDto);
  }
}
