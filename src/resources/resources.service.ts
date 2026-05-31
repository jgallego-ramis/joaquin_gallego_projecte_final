import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import type { CreateResourceDto } from './dto/create-resource.dto';
import type { FindResourcesQueryDto } from './dto/find-resources-query.dto';
import type { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './resource.model';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';
import { AssignResourceDto } from './dto/assign-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
  ) {}
  private resources: Resource[] = [];

  findAll(query: FindResourcesQueryDto): Promise<Resource[]> {
    const { type, status } = query;
    const where: FindOptionsWhere<Resource> = {};

    if (type !== undefined) {
      where.type = type;
    }

    if (status !== undefined) {
      where.status = status;
    }

    return this.resourcesRepository.find({ where });
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return resource;
  }

  create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = this.resourcesRepository.create({
      name: createResourceDto.name,
      type: createResourceDto.type,
      status: 'available',
      location: createResourceDto.location,
      createdAt: new Date().toISOString(),
    });

    return this.resourcesRepository.save(newResource);
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto,
  ): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    Object.assign(resource, updateResourceDto);

    return this.resourcesRepository.save(resource);
  }

  async remove(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    return this.resourcesRepository.remove(resource);
  }

  async assign(
    id: number,
    assignResourceDto: AssignResourceDto,
  ): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    if (resource.status === 'assigned' && resource.assignedToUserId !== null) {
      throw new ConflictException('Resource is already assigned');
    }

    resource.status = 'assigned';
    resource.assignedToUserId = assignResourceDto.userId;

    return this.resourcesRepository.save(resource);
  }

  async release(id: number): Promise<Resource> {
    const resource = await this.resourcesRepository.findOneBy({ id });

    if (!resource) {
      throw new NotFoundException(`Resource with id ${id} not found`);
    }

    resource.status = 'available';
    resource.assignedToUserId = null;

    return this.resourcesRepository.save(resource);
  }
}
