
import React, { createContext, useContext, useMemo, useReducer } from 'react';
import type { CaseItem, NewCaseDraft, CaseSituation } from '../types/case';

type State = {
  cases: CaseItem[];
  draft: NewCaseDraft;
  lastCreatedCaseID: string | null;
};

type Action =
  | { type: "draft/addPhoto"; photoURI: string }
  | { type: "draft/removePhoto"; photoURI: string }
  | { type: "draft/clearPhotos" }
  | { type: "draft/setSituation"; situation: CaseSituation | null }
  | { type: "draft/setNotes"; notes: string }
  | { type: "draft/setLocation"; latitude: number; longitude: number }
  | { type: "draft/reset" }
  | { type: "cases/addFormDraft"; preGenerateID: string };

const MAX_PHOTOS = 3;


const initialDraft: NewCaseDraft = {
  photoUris: [],
  location: {
    latitude: 0,
    longitude: 0,
  },
  situation: null,
  notes: "",
 //lastCreatedCaseID: null,
};

const initialState: State = {
  cases: [
    {
      id: "1",
      status: "ABERTO",
      situation: "Ferido",
      notes: "Cachorro ferido encontrado na rua.",
      createdAtISO: "2024-06-01T10:00:00Z",
      location: {
        latitude: -23.55052,
        longitude: -46.633308,
      },
      photosCount: 3,
      assignedTo: {
        name: "Maria Silva",
        org: "ONG Animais São Paulo",
      },
      updates: [
        { atISO: "2024-06-02T12:00:00Z", text: "Cachorro levado para clínica veterinária." },
        { atISO: "2024-06-03T15:30:00Z", text: "Realizados exames, aguardando resultados." },
      ],
    }
  ],
  draft: initialDraft,
  lastCreatedCaseID: null
};

function genID() {
  return Math.random().toString(36).substr(2, 9);
}

function isValidLocation(lat: number, lon: number): boolean {
  return lat !== 0 && lon !== 0;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "draft/addPhoto":
      return { ...state, draft: 
        { ...state.draft, photoUris: [...state.draft.photoUris, action.photoURI] } };
    case "draft/removePhoto":
      return { ...state, draft: 
        { ...state.draft, photoUris: state.draft.photoUris.filter(uri => uri !== action.photoURI) } };
    case "draft/clearPhotos":
      return { ...state, draft: 
        { ...state.draft, photoUris: [] } };
    case "draft/setSituation":
      return { ...state, draft: { ...state.draft, situation: action.situation } };
    case "draft/setNotes":
      return { ...state, draft: { ...state.draft, notes: action.notes } };
    case "draft/setLocation":
      return { ...state, draft: { ...state.draft, location: { latitude: action.latitude, longitude: action.longitude } } };
    case "draft/reset":
      return { ...state, draft: initialDraft };
    case "cases/addFormDraft":
      if (!state.draft.situation) return state; // situation is required
      if (!isValidLocation(state.draft.location.latitude, state.draft.location.longitude))
         return state; // valid location is required
      const newCase: CaseItem = {
        id: action.preGenerateID,
        status: "ABERTO",
        situation: state.draft.situation,
        notes: state.draft.notes,
        createdAtISO: new Date().toISOString(),
        location: state.draft.location,
        photosCount: state.draft.photoUris.length,
        photoUris: [...state.draft.photoUris],
      };
      return { 
              ...state, cases: [...state.cases, newCase], 
              draft: initialDraft, 
              lastCreatedCaseID: newCase.id
             };
    default:
      return state;
  }
}

const AppStoreContext = createContext<{ state: State; dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
} 