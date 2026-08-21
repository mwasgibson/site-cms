<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TestimonialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    public function rules(): array
    {
        return [
            'client_name' => ['required', 'string', 'max:255'],
            'client_role' => ['nullable', 'string', 'max:255'],
            'client_org' => ['nullable', 'string', 'max:255'],
            'logo_url' => ['nullable', 'url', 'max:2048'],
            'quote' => ['required', 'string', 'max:2000'],
            'sort_order' => ['sometimes', 'integer', 'min:0'],
            'is_published' => ['sometimes', 'boolean'],
        ];
    }
}
