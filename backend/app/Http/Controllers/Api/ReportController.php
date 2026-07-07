<?php

namespace App\Http\Controllers\Api;

use App\DTOs\NotificationDTO;
use App\Enums\NotificationType;
use App\Http\Resources\ReportResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ReportController extends ApiController
{
    public function __construct(private readonly NotificationService $notifications)
    {
    }

    public function reportPost(Request $request, Post $post): JsonResponse
    {
        return $this->create($request, $post, 'Publicacao denunciada com sucesso');
    }

    public function reportComment(Request $request, Comment $comment): JsonResponse
    {
        return $this->create($request, $comment, 'Comentario denunciado com sucesso');
    }

    private function create(Request $request, Model $reportable, string $message): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string', 'max:2000'],
        ]);

        if ($reportable->user_id === $request->user()->id) {
            throw ValidationException::withMessages([
                'report' => ['Nao e possivel denunciar o proprio conteudo.'],
            ]);
        }

        $report = Report::query()->firstOrCreate(
            [
                'reporter_id' => $request->user()->id,
                'reportable_type' => $reportable::class,
                'reportable_id' => $reportable->id,
            ],
            [
                'reason' => $data['reason'],
                'description' => $data['description'] ?? null,
            ],
        );

        if (! $report->wasRecentlyCreated) {
            throw ValidationException::withMessages([
                'report' => ['Ja denunciou este conteudo.'],
            ]);
        }

        $this->notifyAdmins($request->user()->id, $report);

        return $this->success(
            new ReportResource($report->load(['reporter', 'reportable.user'])),
            $message,
            201
        );
    }

    private function notifyAdmins(int $senderId, Report $report): void
    {
        User::query()
            ->where('role', 'admin')
            ->where('is_active', true)
            ->each(function (User $admin) use ($senderId, $report): void {
                if ($admin->id === $senderId) {
                    return;
                }

                $this->notifications->create(new NotificationDTO(
                    recipientId: $admin->id,
                    senderId: $senderId,
                    type: NotificationType::ReportCreated,
                    data: [
                        'report_id' => $report->id,
                        'reportable_type' => class_basename($report->reportable_type),
                        'reportable_id' => $report->reportable_id,
                    ],
                ));
            });
    }
}
