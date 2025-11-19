import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { GetItemsDto } from '../dto/get-items.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(getItemsDto: GetItemsDto): Promise<{ items: Item[] }> {
    // Если не указан limit - возвращаем все данные
    if (!getItemsDto.limit && !getItemsDto.offset) {
      const items = await this.itemsRepository.find({
        order: { createdAt: 'DESC' },
      });
      return { items };
    }

    const limit = getItemsDto.limit || 10;
    const offset = getItemsDto.offset || 0;

    const items = await this.itemsRepository.query(
      `
      SELECT id, created_at as "createdAt" 
      FROM items 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `,
      [limit, offset],
    );

    return { items };
  }

  async findAllCached(getItemsDto: GetItemsDto): Promise<{ items: Item[] }> {
    const cacheKey = `items_${getItemsDto.limit}_${getItemsDto.offset}`;

    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      console.log('Данные из кэша:', cacheKey);
      return cached as { items: Item[]; total: number };
    }

    const result = await this.findAll(getItemsDto);

    // Кэширование с увеличенным TTL для первой страницы или кэшировать только первые 10 страниц, чтобы избежать переполнение памяти
    let ttl = 30000;
    if (getItemsDto.offset === 0) {
      ttl = 120000;
    }

    await this.cacheManager.set(cacheKey, result, ttl);

    return result;
  }
}
