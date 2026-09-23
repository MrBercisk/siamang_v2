import React, { useState } from 'react';
import { useProgressMagang } from '../hooks/useProgressMagang';
import { ProgressTable } from './progress/ProgressTable';
import { ProgressFormView } from './progress/ProgressFormView';
import { ProgressDetailView } from './progress/ProgressDetailView';
import type { ProgressFormValues, ProgressItem } from '../../../types/progressPeserta';

type ViewMode = 'table' | 'form' | 'detail';

export const ProgressMagangPesertaView: React.FC = () => {
  const { items, loading, submitting, submitCreate, submitUpdate } = useProgressMagang();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedItem, setSelectedItem] = useState<ProgressItem | null>(null);
  const [editingItem, setEditingItem] = useState<ProgressItem | null>(null);

  const handleAdd = () => {
    setEditingItem(null);
    setViewMode('form');
  };

  const handleEdit = (item: ProgressItem) => {
    setEditingItem(item);
    setViewMode('form');
  };

  const handleView = (item: ProgressItem) => {
    setSelectedItem(item);
    setViewMode('detail');
  };

  const handleFormSubmit = async (values: ProgressFormValues, file: File | null) => {
    const success = editingItem
      ? await submitUpdate(editingItem.id, values, file)
      : await submitCreate(values, file as File);

    if (success) setViewMode('table');
    return success;
  };
  return (
    <div className="space-y-6 animate-fade-in font-sans text-slate-800">
      {viewMode === 'table' && (
        <ProgressTable
          items={items}
          loading={loading}
          onAdd={handleAdd}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}

      {viewMode === 'form' && (
        <ProgressFormView
          editingItem={editingItem}
          submitting={submitting}
          onCancel={() => setViewMode('table')}
          onSubmit={handleFormSubmit}
        />
      )}

      {viewMode === 'detail' && selectedItem && (
        <ProgressDetailView item={selectedItem} onBack={() => setViewMode('table')} />
      )}
    </div>
  );
};