export interface GenerationRequest {
  sofaImageUrl: string;
  fabricId: string;
  fabricImageUrl: string;
  fabricName: string;
}

export interface GenerationResponse {
  success: boolean;
  resultImageUrl?: string;
  error?: string;
  remainingGenerations: number;
}

export type GenerationStatus =
  | "idle"
  | "uploading"
  | "generating"
  | "complete"
  | "error";

export interface GenerationState {
  status: GenerationStatus;
  progress?: number;
  message?: string;
  resultUrl?: string;
  error?: string;
}
