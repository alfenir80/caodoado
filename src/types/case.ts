export type CaseStatus = "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO";

export type CaseSituation = "Ferido" | "Perdido" | "Abandonado" | "Maus tratos";

export type CaseItem = {
  id: string;
  status: CaseStatus;
  situation: CaseSituation;
  notes?: string;
  createdAtISO: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photosCount: number;
  photoUris?: string[]; // optional, only for drafts  

  assignedTo?: {
    name: string;
    org?: string;
  };

  updates?: Array<{ atISO: string; text: string }>;
};

export type NewCaseDraft = {
  photoUris: string[];
  location: {
    latitude: number;
    longitude: number;
  };
  situation: CaseSituation | null;
  notes: string;
  //lastCreatedCaseID: string | null;
};