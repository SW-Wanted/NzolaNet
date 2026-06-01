<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\NotificationResource;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends ApiController
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return $this->success(
            NotificationResource::collection($this->notifications->forUser($request->user()->id, $this->perPage($request))),
            'Notificacoes listadas com sucesso'
        );
    }

    public function markAsRead(Request $request, int $id): JsonResponse
    {
        return $this->success(
            new NotificationResource($this->notifications->markAsRead($id, $request->user()->id)),
            'Notificacao marcada como lida'
        );
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
