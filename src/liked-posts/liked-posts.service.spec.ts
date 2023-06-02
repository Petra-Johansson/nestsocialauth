import { Test, TestingModule } from '@nestjs/testing';
import { LikedPostsService } from './liked-posts.service';

describe('LikedPostsService', () => {
  let service: LikedPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikedPostsService],
    }).compile();

    service = module.get<LikedPostsService>(LikedPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
