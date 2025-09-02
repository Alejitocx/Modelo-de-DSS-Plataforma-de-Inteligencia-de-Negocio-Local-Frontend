// src/lib/api.ts

const API_BASE_URL = 'http://localhost:4000'; // La URL de tu backend

// Interfaz para los datos que vienen del endpoint /compare
export interface CompareData {
  ratingOverTime: ChartData;
  reviewsOverTime: ChartData;
  ratingDistribution: ChartData;
}

// Interfaz para los datos de un gráfico
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// Interfaz para los datos que vienen del endpoint /impact
export interface ImpactData {
  byAttribute: AttributeCorrelation[];
  diff: any[];
}

export interface AttributeCorrelation {
  key: string;
  value: string | number | boolean | null;
  avgStars: number;
  count: number;
}

/**
 * Llama al endpoint /compare para obtener las métricas de los competidores.
 */
export async function fetchCompareMetrics(businessIds: string[]): Promise<CompareData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/competitors/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessIds: businessIds,
      // Puedes agregar 'from', 'to', 'interval' si quieres que sean dinámicos
    }),
  });
  if (!response.ok) {
  // Para depurar mejor, podemos mostrar el status del error
    console.error('Error en fetchCompareMetrics:', response.status, response.statusText);
    throw new Error('Error al obtener las métricas de comparación')  }
  return response.json();
}

/**
 * Llama al endpoint /impact para obtener el análisis de atributos.
 */
export async function fetchAttributeImpact(attributes: string[]): Promise<ImpactData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/attributes/impact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attributes: attributes,
      // Puedes agregar 'category' o 'geo' para filtrar
    }),
  });
  if (!response.ok) {
 // Para depurar mejor, podemos mostrar el status del error
    console.error('Error en fetchCompareMetrics:', response.status, response.statusText);
    throw new Error('Error al obtener las métricas de comparación')
  }
  return response.json();
}

// NUEVO: Interfaz para la respuesta paginada de negocios
export interface PaginatedBusinessesResponse {
  totalNegocios: number;
  paginaActual: number;
  totalPaginas: number;
  negocios: any[]; // El array de negocios ahora viene dentro de este objeto
}

/**
 * --- OBTENER TODOS LOS NEGOCIOS (CON PAGINACIÓN) ---
 * Llama al endpoint paginado para obtener la lista de negocios.
 * @param page - El número de página a solicitar.
 * @param limit - La cantidad de resultados por página.
 */
export async function fetchAllBusinesses(page: number = 1, limit: number = 20): Promise<PaginatedBusinessesResponse> {
  // Construimos la URL con los parámetros de consulta para la paginación
  const response = await fetch(`${API_BASE_URL}/negocios?page=${page}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener la lista de negocios');
  }
  
  // La respuesta del backend ahora es un objeto que contiene la lista y la info de paginación
  return response.json();
}