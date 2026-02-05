<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Idempotent create: only create if the table doesn't already exist to avoid duplicate table errors
        if (!Schema::hasTable('lessons')) {
            Schema::create('lessons', function (Blueprint $table) {
                $table->id();
                $table->foreignId('course_id')->constrained()->onDelete('cascade');
                $table->string('title');
                $table->text('content')->nullable();
                $table->string('type')->default('text');
                $table->integer('order')->default(0);
                $table->timestamps();
            });
        }
    }
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
