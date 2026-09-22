import { StyleAnalysisOutput } from './schema';

export interface VisionAnalysisRequest {
  imageBase64: string;
  mimeType: string;
  userPreferences?: {
    lowMaintenanceOnly?: boolean;
    budgetFocus?: boolean;
    stylePreferences?: string[];
  };
}

export interface IVisionProvider {
  readonly name: string;
  analyzePortrait(request: VisionAnalysisRequest): Promise<StyleAnalysisOutput>;
}
