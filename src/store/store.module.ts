import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/entity/store.entity';
import { User } from 'src/entity/user.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([Store, User]) ],
  controllers: [StoreController],
  providers: [StoreService]
})
export class StoreModule {}
