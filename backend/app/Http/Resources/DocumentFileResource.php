<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentFileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'documentType' => $this->document_type,
            'originalName' => $this->original_name,
            'filePath' => $this->file_path,
            'status' => $this->status,
        ];
    }
}