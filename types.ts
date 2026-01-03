
export interface ValidationSegment {
  name: string;
  value: string;
  isValid: boolean;
  expectedDescription: string;
  errorMessage?: string;
}

export interface NamingResult {
  filename: string;
  extension: string;
  isExtensionValid: boolean;
  segments: ValidationSegment[];
  overallValid: boolean;
  aiFeedback?: string;
}

export interface ISOStandard {
  project: string;
  originator: string;
  volume: string;
  level: string;
  type: string;
  role: string;
  number: string;
}
