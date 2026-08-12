<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    use HasFactory;

    protected $fillable = ['application_id', 'full_name', 'email', 'phone', 'nim'];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
