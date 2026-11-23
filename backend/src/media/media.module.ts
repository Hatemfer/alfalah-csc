import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { MediaService } from './media.service';
import { MediaController, PublicMediaController } from './media.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MediaAsset])],
  providers: [MediaService],
  controllers: [MediaController, PublicMediaController],
  exports: [MediaService],
})
export class MediaModule {}
