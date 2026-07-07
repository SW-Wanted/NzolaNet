<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\CommentResource;
use App\Http\Resources\PostResource;
use App\Http\Resources\ReportResource;
use App\Http\Resources\UserResource;
use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use App\Services\CommentService;
use App\Services\PostService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ModerationController extends ApiController
{
    public function __construct(
        private readonly CommentService $comments,
        private readonly PostService $posts,
    ) {
    }

    public function dashboard(): JsonResponse
    {
        $recentReports = Report::query()
            ->with(['reporter', 'reportable.user', 'resolver'])
            ->where('status', Report::STATUS_PENDING)
            ->latest()
            ->limit(3)
            ->get();

        $topPosts = Post::query()
            ->with(['user' => fn ($query) => $query->withCount(['followers', 'following', 'posts'])])
            ->withCount(['likes', 'comments'])
            ->orderByDesc('likes_count')
            ->limit(3)
            ->get();

        $recentLikes = Like::query()
            ->with(['user', 'post.user'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(fn (Like $like): array => [
                'id' => $like->id,
                'user' => $like->user?->name,
                'post_author' => $like->post?->user?->name,
                'post_summary' => str($like->post?->content ?? '')->limit(80)->toString(),
                'created_at' => $like->created_at?->toISOString(),
            ]);

        return $this->success([
            'totals' => [
                'users' => User::query()->count(),
                'active_users' => User::query()->where('is_active', true)->count(),
                'inactive_users' => User::query()->where('is_active', false)->count(),
                'posts' => Post::query()->count(),
                'comments' => Comment::query()->count(),
                'likes' => Like::query()->count(),
                'reports' => Report::query()->count(),
                'pending_reports' => Report::query()->where('status', Report::STATUS_PENDING)->count(),
            ],
            'recent_reports' => ReportResource::collection($recentReports),
            'top_posts' => PostResource::collection($topPosts),
            'recent_likes' => $recentLikes,
        ], 'Resumo administrativo obtido com sucesso');
    }

    public function comments(Request $request): JsonResponse
    {
        return $this->success(
            CommentResource::collection($this->comments->latest($this->perPage($request))),
            'Comentarios listados para moderacao'
        );
    }

    public function destroyComment(Comment $comment): JsonResponse
    {
        $this->comments->delete($comment);

        return $this->noContent('Comentario removido pela moderacao');
    }

    public function posts(Request $request): JsonResponse
    {
        return $this->success(
            PostResource::collection($this->posts->list($this->perPage($request))),
            'Publicacoes listadas para moderacao'
        );
    }

    public function destroyPost(Post $post): JsonResponse
    {
        $this->posts->delete($post);

        return $this->noContent('Publicacao removida pela moderacao');
    }

    public function users(Request $request): JsonResponse
    {
        $query = User::query()
            ->withCount(['followers', 'following', 'posts'])
            ->latest();

        if ($request->filled('status')) {
            $status = $request->string('status')->toString();

            if (in_array($status, ['active', 'inactive'], true)) {
                $query->where('is_active', $status === 'active');
            }
        }

        return $this->success(
            UserResource::collection($query->paginate($this->perPage($request))),
            'Utilizadores listados para administracao'
        );
    }

    public function setUserActive(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        if ($request->user()->is($user) && ! $data['is_active']) {
            throw ValidationException::withMessages([
                'user' => ['Nao pode desativar a propria conta administrativa.'],
            ]);
        }

        $user->forceFill(['is_active' => $data['is_active']])->save();

        if (! $user->is_active) {
            DB::table('personal_access_tokens')
                ->where('tokenable_type', User::class)
                ->where('tokenable_id', $user->id)
                ->delete();
        }

        return $this->success(
            new UserResource($user->refresh()->loadCount(['followers', 'following', 'posts'])),
            $user->is_active ? 'Utilizador ativado com sucesso' : 'Utilizador desativado com sucesso'
        );
    }

    public function setUserRole(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['required', Rule::in([UserRole::Admin->value, UserRole::User->value])],
        ]);

        if ($request->user()->is($user)) {
            throw ValidationException::withMessages([
                'user' => ['Nao pode alterar a propria funcao administrativa.'],
            ]);
        }

        if ($user->created_at->lessThanOrEqualTo($request->user()->created_at)) {
            throw ValidationException::withMessages([
                'user' => ['So pode alterar a funcao de utilizadores criados depois da sua conta.'],
            ]);
        }

        $user->forceFill(['role' => $data['role']])->save();

        return $this->success(
            new UserResource($user->refresh()->loadCount(['followers', 'following', 'posts'])),
            'Funcao do utilizador atualizada com sucesso'
        );
    }

    public function destroyUser(Request $request, User $user): JsonResponse
    {
        if ($request->user()->is($user)) {
            throw ValidationException::withMessages([
                'user' => ['Nao pode eliminar a propria conta administrativa.'],
            ]);
        }

        $user->delete();

        return $this->noContent('Utilizador eliminado pela administracao');
    }

    public function reports(Request $request): JsonResponse
    {
        $query = Report::query()
            ->with(['reporter', 'reportable.user', 'resolver'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        return $this->success(
            ReportResource::collection($query->paginate($this->perPage($request))),
            'Denuncias listadas com sucesso'
        );
    }

    public function report(Report $report): JsonResponse
    {
        return $this->success(
            new ReportResource($report->load(['reporter', 'reportable.user', 'resolver'])),
            'Denuncia obtida com sucesso'
        );
    }

    public function resolveReport(Request $request, Report $report): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', Rule::in(['apagar', 'ignorar', 'aceitar', 'rejeitar'])],
        ]);

        if ($data['action'] === 'apagar') {
            $this->deleteReportable($report);
        }

        $report->forceFill([
            'status' => in_array($data['action'], ['apagar', 'aceitar'], true)
                ? Report::STATUS_ACCEPTED
                : Report::STATUS_REJECTED,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ])->save();

        return $this->success(
            new ReportResource($report->refresh()->load(['reporter', 'reportable.user', 'resolver'])),
            'Denuncia resolvida com sucesso'
        );
    }

    private function deleteReportable(Report $report): void
    {
        $target = $report->reportable;

        if ($target instanceof Post) {
            $this->posts->delete($target);
        }

        if ($target instanceof Comment) {
            $this->comments->delete($target);
        }
    }

    private function perPage(Request $request): int
    {
        return min(max((int) $request->integer('per_page', 15), 1), 50);
    }
}
