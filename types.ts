export enum Persona {
  PRODUCT_MANAGER = 'PRODUCT_MANAGER',
  TECHNICAL_LEAD = 'TECHNICAL_LEAD',
  UX_DESIGNER = 'UX_DESIGNER',
}

export interface PersonaDetails {
  value: Persona;
  label: string;
  description: string;
  systemInstruction: string;
}

export interface SavedSpec {
  id: string;
  description: string;
  persona: Persona;
  spec: string;
  createdAt: string;
}

export interface MediaInput {
  data: string; // base64 encoded string
  mimeType: string;
}
