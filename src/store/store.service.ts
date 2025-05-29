import { Get, Injectable, Param, UseGuards } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entity/user.entity';
import { ApiBasicAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
    constructor(
        @InjectRepository (Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository (User)
        private readonly userRepository: Repository<User>,
    ) {}
   
    async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        const store = this.storeRepository.create({
            ...createStoreDto,
            owner: user,
            createdAt: new Date(),
        });

        return this.storeRepository.save(store);
    }


    async getAll(): Promise<Store[]> {
        return this.storeRepository.find({
            relations: ['owner']
        });   
    }

    async getStoreById(id: Number): Promise<Store> {
        const store = await this.storeRepository.findOne({
            where: { id: Number(id) },
            relations: ['owner']
        });

        if (!store) {
            throw new Error('Store not found');
        }

        return store;
    }

    async updateStore(id: number, updateStoreDto: UpdateStoreDto, userId: number): Promise<Store> {
        const store = await this.storeRepository.findOne({ where:{ id}, relations: ['owner'] });

        if (!store) {
            throw new Error('Store not found');
        }
        if (store.owner.id !== userId) {
            throw new Error('You are not authorized to update this store');
        }

       const updatedStore = Object.assign(store, updateStoreDto);
        return this.storeRepository.save(updatedStore);
    }

    async deleteStore(id: number, userId: number): Promise<void> {
        const store = await this.storeRepository.findOne({ where:{ id}, relations: ['owner'] });

        if (!store) {
            throw new Error('Store not found');
        }
        if (store.owner.id !== userId) {
            throw new Error('You are not authorized to delete this store');
        }

        await this.storeRepository.remove(store);
    }
   
    


    // =====================
}
