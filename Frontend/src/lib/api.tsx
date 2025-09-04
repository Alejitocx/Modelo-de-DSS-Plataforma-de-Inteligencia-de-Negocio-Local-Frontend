// src/lib/api.ts

const API_BASE_URL = 'http://localhost:4000'; 

export interface CompareData {
  ratingOverTime: ChartData;
  reviewsOverTime: ChartData;
  ratingDistribution: ChartData;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

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

export async function fetchCompareMetrics(businessIds: string[]): Promise<CompareData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/competitors/compare`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      businessIds: businessIds,
    }),
  });
  if (!response.ok) {
    console.error('Error en fetchCompareMetrics:', response.status, response.statusText);
    throw new Error('Error al obtener las métricas de comparación')  }
  return response.json();
}

export async function fetchAttributeImpact(attributes: string[]): Promise<ImpactData> {
  const response = await fetch(`${API_BASE_URL}/api/v1/attributes/impact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      attributes: attributes,
    }),
  });
  if (!response.ok) {
    console.error('Error en fetchCompareMetrics:', response.status, response.statusText);
    throw new Error('Error al obtener las métricas de comparación')
  }
  return response.json();
}
export interface PaginatedBusinessesResponse {
  totalNegocios: number;
  paginaActual: number;
  totalPaginas: number;
  negocios: any[]; 
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
  
  return response.json();
}

export async function fetchKpi(kpiRequest: {
  collection: string;
  op: 'count' | 'sum' | 'avg' | 'min' | 'max';
  valueField?: string;
  match: Record<string, any>;
}): Promise<{ value: number }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/metrics/data`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(kpiRequest),
  });
  if (!response.ok) {
    throw new Error(`Error al obtener el KPI: ${kpiRequest.op}`);
  }
  return response.json();
}

export async function fetchBusinessAttributes(businessIds: string[]): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/attributes/attributes-compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessIds }),
  });
  if (!response.ok) {
    throw new Error('Error al obtener los atributos de los negocios');
  }
  return response.json();
}

export async function uploadJsonFile(
  file: File,
  collectionType: 'negocios' | 'resenas' | 'tips' | 'usuario' | 'checkin'
): Promise<any> {
  const formData = new FormData();
  formData.append('file', file); 
  formData.append('type', collectionType); 

  const response = await fetch(`${API_BASE_URL}/api/v1/admin/upload-json`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al subir el archivo');
  }
  return response.json();
}