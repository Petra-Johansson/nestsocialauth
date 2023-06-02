import { Test, TestingModule } from '@nestjs/testing';
import { LikedPostsController } from './liked-posts.controller';
import { LikedPostsService } from './liked-posts.service';

describe('LikedPostsController', () => {
  let controller: LikedPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikedPostsController],
      providers: [LikedPostsService],
    }).compile();

    controller = module.get<LikedPostsController>(LikedPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
