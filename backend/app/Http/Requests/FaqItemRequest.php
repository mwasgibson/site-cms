<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FaqItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // True because route-level auth:sanctum middleware already gates this.
        return true;
    }
    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
