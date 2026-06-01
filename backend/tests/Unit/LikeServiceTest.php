<?php

namespace Tests\Unit;

use App\Models\Post;
use App\Repositories\Contracts\LikeRepositoryInterface;
use App\Services\LikeService;
use Illuminate\Validation\ValidationException;
use Mockery;
use Tests\TestCase;

class LikeServiceTest extends TestCase
{
    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_like_service_blocks_duplicate_like_before_persistence(): void
    {
        $repository = Mockery::mock(LikeRepositoryInterface::class);
        $repository->shouldReceive('exists')->once()->with(10, 22)->andReturnTrue();

        $service = new LikeService($repository);
        $post = new Post(['user_id' => 1]);
        $post->id = 22;

        $this->expectException(ValidationException::class);

        $service->like(10, $post);
    }
}
