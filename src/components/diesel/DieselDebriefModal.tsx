import { Alert, AlertDescription } from '@/components/ui/alert';
import Button from '@/components/ui/button-variants';
import { Input, TextArea } from '@/components/ui/form-elements';
import Modal from '@/components/ui/modal';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatDate, formatNumber } from '@/lib/formatters';
import { AlertCircle, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface TrailerFuelData {
  trailer_id: string;
  operating_hours: number;
  litres_per_hour: number;
  total_litres: number;
}

export interface DieselRecord {
  id: string;
  trip_number?: string;
  vehicle_identifier?: string;
  driver_name?: string;
  litres_consumed?: number;
  total_km?: number;
  km_per_litre?: number;
  trailer_fuel_data?: TrailerFuelData[];
  fleet_number?: string;
  date?: string;
  fuel_station?: string;
  litres_filled?: number;
  vehicle_litres_only?: number;
  trailer_litres_total?: number;
  total_cost?: number;
  currency?: 'ZAR' | 'USD';
  distance_travelled?: number;
  probe_discrepancy?: number;
  debrief_notes?: string;
  debrief_signed_by?: string;
  debrief_signed?: boolean;
}

export interface BatchDebriefData {
  recordIds: string[];
  debrief_notes: string;
  debrief_signed_by: string;
  debrief_signed_at: string;
  debrief_date: string;
}

interface BatchDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Array of diesel records for the selected fleet */
  dieselRecords: DieselRecord[];
  /** The fleet number these records belong to */
  fleetNumber: string;
  /** Callback to complete multiple debriefs at once */
  onBatchDebrief: (debriefData: BatchDebriefData) => Promise<void>;
}

const BatchDebriefModal = ({
  isOpen,
  onClose,
  dieselRecords,
  fleetNumber,
  onBatchDebrief,
}: BatchDebriefModalProps) => {
  const [formData, setFormData] = useState({
    debrief_notes: '',
    debrief_signed_by: '',
  });

  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [operationSuccess, setOperationSuccess] = useState(false);

  // Filter out already debriefed records
  const pendingRecords = dieselRecords.filter(record => !record.debrief_signed);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        debrief_notes: '',
        debrief_signed_by: '',
      });
      setSelectedRecords(new Set());
      setSelectAll(false);
      setErrors({});
      setOperationError(null);
      setOperationSuccess(false);
    }
  }, [isOpen]);

  // Handle select all checkbox
  useEffect(() => {
    if (selectAll) {
      const allIds = new Set(pendingRecords.map(record => record.id));
      setSelectedRecords(allIds);
    } else {
      setSelectedRecords(new Set());
    }
  }, [selectAll, pendingRecords]);

  const handleSelectRecord = (recordId: string, checked: boolean) => {
    const newSelected = new Set(selectedRecords);
    if (checked) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
      setSelectAll(false);
    }
    setSelectedRecords(newSelected);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.debrief_signed_by) {
      newErrors.debrief_signed_by = 'Signature name is required';
    }

    if (selectedRecords.size === 0) {
      newErrors.records = 'Please select at least one record to debrief';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBatchDebrief = async () => {
    if (!validate()) return;

    setIsProcessing(true);
    setOperationError(null);

    try {
      const batchData: BatchDebriefData = {
        recordIds: Array.from(selectedRecords),
        debrief_notes: formData.debrief_notes,
        debrief_signed_by: formData.debrief_signed_by,
        debrief_signed_at: new Date().toISOString(),
        debrief_date: new Date().toISOString().split('T')[0],
      };

      console.log('Batch debriefing records:', batchData);

      await onBatchDebrief(batchData);

      console.log('Batch debrief completed successfully');

      setOperationSuccess(true);

      // Close modal after successful completion
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Batch debrief failed:', error);
      setOperationError(error instanceof Error ? error.message : 'Failed to complete batch debrief');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPerformanceIssueCount = (record: DieselRecord): number => {
    let count = 0;
    if (record.km_per_litre && record.km_per_litre < 2) count++;
    if (record.probe_discrepancy && record.probe_discrepancy > 5) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Batch Debrief - Fleet ${fleetNumber}`}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-4">
        {operationSuccess && (
          <Alert className="bg-success/10 border-success">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Batch debrief completed successfully! {selectedRecords.size} records processed.
            </AlertDescription>
          </Alert>
        )}

        {operationError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{operationError}</AlertDescription>
          </Alert>
        )}

        {errors.records && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.records}</AlertDescription>
          </Alert>
        )}

        {/* Summary Card */}
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Fleet {fleetNumber}</h4>
              <p className="text-sm text-muted-foreground">
                {pendingRecords.length} pending records • {selectedRecords.size} selected
              </p>
            </div>
            <div className="text-sm bg-background px-3 py-1 rounded-full">
              Total Litres: {formatNumber(
                Array.from(selectedRecords).reduce((sum, id) => {
                  const record = dieselRecords.find(r => r.id === id);
                  return sum + (record?.litres_filled || 0);
                }, 0)
              )} L
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => setSelectAll(checked as boolean)}
                    disabled={pendingRecords.length === 0}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Station</TableHead>
                <TableHead className="text-right">Litres</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">km/L</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No pending records to debrief for this fleet
                  </TableCell>
                </TableRow>
              ) : (
                pendingRecords.map((record) => {
                  const issueCount = getPerformanceIssueCount(record);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRecords.has(record.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRecord(record.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.driver_name || 'N/A'}</TableCell>
                      <TableCell>{record.fuel_station}</TableCell>
                      <TableCell className="text-right">
                        {formatNumber(record.litres_filled)} L
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(record.total_cost, record.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.km_per_litre ? formatNumber(record.km_per_litre, 2) : '-'}
                      </TableCell>
                      <TableCell>
                        {issueCount > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs">
                            {issueCount} issue{issueCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Debrief Form */}
        <div className="space-y-4 mt-4">
          <TextArea
            label="Debrief Notes (applies to all selected records)"
            value={formData.debrief_notes}
            onChange={(e) => setFormData({ ...formData, debrief_notes: e.target.value })}
            disabled={isProcessing}
            rows={3}
            placeholder="Enter any common notes for all selected records..."
          />

          <Input
            label="Signed By"
            value={formData.debrief_signed_by}
            onChange={(e) => setFormData({ ...formData, debrief_signed_by: e.target.value })}
            error={errors.debrief_signed_by}
            disabled={isProcessing}
            placeholder="Enter your name to sign off"
            required
          />
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            By signing this batch debrief, you confirm that you have reviewed all selected diesel records
            and any issues have been noted. This will mark {selectedRecords.size} record(s) as completed.
          </AlertDescription>
        </Alert>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            onClick={handleBatchDebrief}
            disabled={isProcessing || selectedRecords.size === 0}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing {selectedRecords.size} records...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Complete Batch Debrief ({selectedRecords.size})
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BatchDebriefModal;