<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentFile extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'document_type',
        'original_name',
        'file_path',
        'file_size',
        'mime_type',
        'status',
    ];

    public function application()
    {
        return $this->belongsTo(Application::class);
    }
}
