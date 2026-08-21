<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Key-value on purpose: mirrors lib/site-config.ts on the marketing site,
        // but lets new settings be added from the admin UI without a migration.
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g. "contact_email", "company_name"
            $table->text('value')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
