<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHallsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('halls', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name')->unique();
            $table->json('places')->default('{"disabled": [],"vip": []}');
            $table->integer('vipPrice')->default(env('MIN_VIP_PRICE'));
            $table->integer('standardPrice')->default(env('MIN_STANDARD_PRICE'));
            $table->integer('rowsCount')->default(10);
            $table->integer('placesInRow')->default(8);
            $table->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('halls');
    }
}
