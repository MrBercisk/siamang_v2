<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Resend, Postmark, AWS, and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'google_calendar' => [
        'credentials'      => env('GOOGLE_CALENDAR_CREDENTIALS', storage_path('app/google/credentials.json')),
        'calendar_id'      => env('GOOGLE_CALENDAR_ID'),
        'timezone'         => env('GOOGLE_CALENDAR_TIMEZONE', 'Asia/Jakarta'),
        'impersonate'      => env('GOOGLE_CALENDAR_IMPERSONATE'),
        'sync_past_days'   => 30,   // rentang tarik: 30 hari ke belakang
        'sync_future_days' => 180,  // ... sampai 180 hari ke depan
    ],

];
