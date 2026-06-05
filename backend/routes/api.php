<?php

use App\Http\Controllers\Api\Admin\ModerationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\FeedController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json([
    'success' => true,
    'message' => 'NzolaNet API operacional',
    'data' => [
        'name' => 'NzolaNet API',
        'version' => '1.0.0',
        'documentation' => url('/docs'),
        'openapi' => url('/docs/openapi.yaml'),
    ],
]));

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::fallback(fn () => response()->json([
    'success' => false,
    'message' => 'Rota da API nao encontrada',
    'errors' => [],
], 404));

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show'])->whereNumber('id');
    Route::put('users/profile', [UserController::class, 'updateProfile']);
    Route::post('users/profile-photo', [UserController::class, 'updateProfilePhoto']);
    Route::post('users/{id}/follow', [UserController::class, 'follow'])->whereNumber('id');
    Route::delete('users/{id}/follow', [UserController::class, 'unfollow'])->whereNumber('id');
    Route::get('users/{user}/followers', [UserController::class, 'followers']);
    Route::get('users/{user}/following', [UserController::class, 'following']);

    Route::apiResource('posts', PostController::class);
    Route::post('posts/{post}/like', [LikeController::class, 'store']);
    Route::delete('posts/{post}/like', [LikeController::class, 'destroy']);
    Route::get('posts/{post}/comments', [CommentController::class, 'index']);
    Route::post('posts/{post}/comments', [CommentController::class, 'store']);

    Route::put('comments/{comment}', [CommentController::class, 'update']);
    Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

    Route::get('feed', [FeedController::class, 'global']);
    Route::get('feed/following', [FeedController::class, 'following']);

    Route::get('notifications', [NotificationController::class, 'index']);
    Route::patch('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->whereNumber('id');

    Route::middleware('admin')->prefix('admin')->group(function (): void {
        Route::delete('comments/{comment}', [ModerationController::class, 'destroyComment']);
    });
});
