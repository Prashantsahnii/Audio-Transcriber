export enum ActiveTab {
  Upload = 'upload',
  Record = 'record',
}

export interface TranscriptionHistoryItem {
  id: string;
  text: string;
  timestamp: number;
}
