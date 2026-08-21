<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('excerpt', 320)->nullable();
            $table->longText('body'); // markdown
            $table->string('cover_image_url')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index('published_at');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
