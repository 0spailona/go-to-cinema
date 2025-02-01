<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeancesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seances', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->timestampsTz();
            $table->string('hallId');
            $table->string('movieId');
            $table->foreign('hallId')->references('id')->on('halls')->onDelete('cascade');
            $table->foreign('movieId')->references('id')->on('movies')->onDelete('cascade');
            $table->dateTimeTz('startTime');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seances');
    }
}
