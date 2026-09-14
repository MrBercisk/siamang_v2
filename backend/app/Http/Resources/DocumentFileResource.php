<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DocumentFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'documentType' => $this->document_type,
            'originalName' => $this->original_name,
            'filePath' => $this->file_path,
            'fileUrl' => $this->file_path
                ? Storage::url($this->file_path)
                : null,
            'status' => $this->status,
        ];
    }
}