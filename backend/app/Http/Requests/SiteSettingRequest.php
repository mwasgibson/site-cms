<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    /**
     * Keys mirror lib/site-config.ts on the marketing site 1:1. Adding a new
     * setting means adding it here AND in site-config.ts — there's no way to
     * enforce that link automatically across two separate repos, so if you
     * add a field to one, add it to the other.
     */
    public function rules(): array
    {
        return [
            'product_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'company_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'tagline' => ['sometimes', 'nullable', 'string', 'max:255'],
            'domain' => ['sometimes', 'nullable', 'string', 'max:255'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'street_address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_locality' => ['sometimes', 'nullable', 'string', 'max:255'],
            'address_country' => ['sometimes', 'nullable', 'string', 'max:2'],
            'regulator' => ['sometimes', 'nullable', 'string', 'max:255'],
            'licence' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data_law' => ['sometimes', 'nullable', 'string', 'max:255'],
            'social_linkedin' => ['sometimes', 'nullable', 'string', 'max:255'],
            'social_x' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
