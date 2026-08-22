<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PageSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Deliberately loose: "content" shape differs per section key (hero vs.
     * a list of features vs. a list of steps), and there's no per-key
     * schema registry on the backend. The admin frontend's typed forms are
     * what keep the shape sane in practice — this just guards against
     * garbage requests, not against a well-formed-but-wrong-shaped payload.
     */
    public function rules(): array
    {
        return [
            'content' => ['required', 'array'],
        ];
    }
}
