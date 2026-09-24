// dataSource.js
// Permet de changer API ↔ mocks sans toucher aux composants

import * as api from "./api.js";
import * as mock from "../mocks/mockData.js";

// Active les mocks si la variable d'environnement est définie
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Choix de la source
export const dataSource = USE_MOCK ? mock : api;

// Pour mock par défaut : 
// const USE_API = import.meta.env.VITE_USE_API === "true";
// export const dataSource = USE_API ? api : mock;