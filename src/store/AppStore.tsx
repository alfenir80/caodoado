
import React, { createContext, use, useContext,
  useEffect, useMemo, useReducer } from 'react';
import type { CaseItem, NewCaseDraft, CaseSituation } from '../types/case';
import AsyncStorage from '@react-native-async-storage/async-storage';


// ─── Chave usada no AsyncStorage ─────────────────────────────────────────────

const STORAGE_KEY = "@caodoado:cases";

// ─── Tipos de estado e ações ──────────────────────────────────────────────────

type State = {
  cases: CaseItem[];
  draft: NewCaseDraft;
  lastCreatedCaseID: string | null;
  loadingCases: boolean; // Indica se os casos estão sendo carregados do AsyncStorage
};

type Action =
  | { type: "draft/addPhoto"; photoURI: string }
  | { type: "draft/removePhoto"; photoURI: string }
  | { type: "draft/clearPhotos" }
  | { type: "draft/setSituation"; situation: CaseSituation | null }
  | { type: "draft/setNotes"; notes: string }
  | { type: "draft/setLocation"; latitude: number; longitude: number }
  | { type: "draft/reset" }
  | { type: "cases/hydrate"; cases: CaseItem[] }
  | { type: "cases/add"; newCase: CaseItem }
  | { type: "cases/setLoading"; loading: boolean };

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
  lastCreatedCaseID: null,
  loadingCases: false
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
      return { ...state, draft: initialDraft, lastCreatedCaseID: null };
    //disparado na inicialização do app para carregar os casos do AsyncStorage
    case "cases/hydrate":
      return { ...state, cases: action.cases, loadingCases: false };
    //adiciona um novo caso à lista e salva no AsyncStorage
    case "cases/add":
      return { ...state, 
        cases: [...state.cases, action.newCase], 
        lastCreatedCaseID: action.newCase.id };
    case "cases/setLoading":
      return { ...state, loadingCases: action.loading };
    default:
      return state;
  }
}

//Helper para salvar casos no AsyncStorage

async function loadCases(): Promise<CaseItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw != null ? (JSON.parse(raw) as CaseItem[]) : [];
  } catch (e) {
    console.error("Failed to load cases from AsyncStorage", e);
    return [];
  }
}

async function saveCases(cases: CaseItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.error("Failed to save cases to AsyncStorage", e);
  }
}

const AppStoreContext = createContext<{ 
  state: State; 
  dispatch: React.Dispatch<Action> } | undefined>(undefined);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Na inicialização, carregar casos do AsyncStorage
  useEffect(() => {
    dispatch({ type: "cases/setLoading", loading: true });
    loadCases().then(cases => {
      dispatch({ type: "cases/hydrate", cases });
    });
  }, []);

  // Sempre que os casos mudarem, salvar no AsyncStorage
  useEffect(() => {
    if (!state.loadingCases) {
      saveCases(state.cases);
    }
  }, [state.cases, state.loadingCases]);

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