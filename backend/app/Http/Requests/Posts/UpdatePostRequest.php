<?php

namespace App\Http\Requests\Posts;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'content' => ['sometimes', 'string', 'max:5000'],
            'image' => ['sometimes', 'nullable', 'image', 'max:8192'],
            'video' => ['sometimes', 'nullable', 'file', 'mimetypes:video/mp4,video/quicktime,video/x-msvideo,video/webm', 'max:51200'],
            'remove_image' => ['sometimes', 'boolean'],
            'remove_video' => ['sometimes', 'boolean'],
        ];
    }
}
