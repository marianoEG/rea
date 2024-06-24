export interface SyncFormResult {
    totalSynchronized: number;
    hasError: boolean;
    filesToDelete: string[];
    totalSyncWithQR?: number;
}