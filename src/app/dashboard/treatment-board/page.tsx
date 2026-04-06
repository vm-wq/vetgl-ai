'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { TreatmentBoard, TreatmentEntry } from '@/components/clinical/TreatmentBoard';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function TreatmentBoardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [entries, setEntries] = useState<TreatmentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch treatment entries
  const fetchEntries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Erro ao autenticar');
        return;
      }

      // Fetch active treatment entries
      const { data: treatmentData, error: treatmentError } = await supabase
        .from('treatment_entries')
        .select(`
          id,
          case_id,
          status,
          treatments,
          vitals,
          admitted_at,
          discharged_at,
          cases (
            id,
            patient_name,
            species,
            chief_complaint
          )
        `)
        .neq('status', 'discharged')
        .order('admitted_at', { ascending: false });

      if (treatmentError) {
        console.error('Error fetching treatment entries:', treatmentError);
        setError('Erro ao carregar internados');
        return;
      }

      // Transform data
      const transformed: TreatmentEntry[] = (treatmentData || []).map((entry: any) => ({
        id: entry.id,
        case_id: entry.case_id,
        patient_name: entry.cases?.patient_name || 'Sem nome',
        species: entry.cases?.species || 'Desconhecido',
        chief_complaint: entry.cases?.chief_complaint || 'Sem queixa principal',
        admitted_at: entry.admitted_at,
        status: entry.status,
        treatments: entry.treatments || [],
        vitals: entry.vitals || {},
      }));

      setEntries(transformed);
    } catch (err) {
      console.error('Error in fetchEntries:', err);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();

    // Real-time subscription to changes
    const subscription = supabase
      .channel('treatment_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'treatment_entries',
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleStatusChange = async (
    entryId: string,
    newStatus: 'admitted' | 'treating' | 'discharged'
  ) => {
    try {
      const { error } = await supabase
        .from('treatment_entries')
        .update({
          status: newStatus,
          discharged_at: newStatus === 'discharged' ? new Date().toISOString() : null,
        })
        .eq('id', entryId);

      if (error) {
        setError('Erro ao atualizar status');
        return;
      }

      // Update local state
      setEntries(
        entries.map((e) =>
          e.id === entryId ? { ...e, status: newStatus } : e
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Erro ao atualizar status');
    }
  };

  const handleAddTreatment = (entryId: string) => {
    // Navigate to treatment details or show modal
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      router.push(`/dashboard/cases/${entry.case_id}?tab=treatment`);
    }
  };

  const handleAddVitals = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      router.push(`/dashboard/cases/${entry.case_id}?tab=vitals`);
    }
  };

  const handleGenerateSOAP = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      router.push(`/dashboard/cases/${entry.case_id}?tab=soap`);
    }
  };

  const handleViewDetails = (entryId: string) => {
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      router.push(`/dashboard/cases/${entry.case_id}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => fetchEntries()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : (
          <TreatmentBoard
            entries={entries}
            onStatusChange={handleStatusChange}
            onAddTreatment={handleAddTreatment}
            onAddVitals={handleAddVitals}
            onGenerateSOAP={handleGenerateSOAP}
            onViewDetails={handleViewDetails}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
