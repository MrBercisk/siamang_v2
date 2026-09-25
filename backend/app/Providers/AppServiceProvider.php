<?php

namespace App\Providers;

use App\Models\Application;
use App\Models\Bimbingan;
use App\Observers\ApplicationObserver;
use App\Observers\BimbinganObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Application::observe(ApplicationObserver::class);
        Bimbingan::observe(BimbinganObserver::class);
    }
}
