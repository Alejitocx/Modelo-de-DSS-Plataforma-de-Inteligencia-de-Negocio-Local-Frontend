import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

/**
 * Interfaz para los datasets de gráficos
 * @property {string} label - Etiqueta/nombre del dataset
 * @property {(number | null)[]} data - Array de valores numéricos o nulos
 * @property {string} color - Color hexadecimal para representar el dataset
 */
interface ChartDataset { 
  label: string; 
  data: (number | null)[]; 
  color: string; 
}

/**
 * Interfaz para la estructura completa de datos de gráficos
 * @property {string[]} labels - Array de etiquetas para el eje X
 * @property {ChartDataset[]} datasets - Array de datasets a visualizar
 */
interface ChartData { 
  labels: string[]; 
  datasets: ChartDataset[]; 
}

/**
 * Props para el componente MetricsCharts
 * @property {ChartData} [ratingData] - Datos para el gráfico de tendencia de puntuación
 * @property {ChartData} [volumeData] - Datos para el gráfico de volumen de reseñas
 * @property {ChartData} [distributionData] - Datos para el gráfico de distribución de calificaciones
 */
interface MetricsChartsProps { 
  ratingData?: ChartData; 
  volumeData?: ChartData; 
  distributionData?: ChartData; 
}

/**
 * Transforma los datos de la API al formato requerido por Recharts
 * @param {ChartData} [apiData] - Datos en formato de la API
 * @returns {Array} Array de objetos en formato {name: string, dataset1: number, dataset2: number, ...}
 */
const transformApiDataForChart = (apiData?: ChartData) => {
  if (!apiData || !apiData.labels || !apiData.datasets) return [];
  const { labels, datasets } = apiData;
  
  return labels.map((label, index) => {
    const dataPoint: { [key: string]: any } = { name: label };
    datasets.forEach(dataset => { 
      dataPoint[dataset.label] = dataset.data[index]; 
    });
    return dataPoint;
  });
};

/**
 * Componente que muestra tres gráficos comparativos de métricas de negocios
 * - Gráfico de línea para tendencia de puntuación (con media móvil de 10 años)
 * - Gráfico de barras para volumen de reseñas por mes
 * - Gráfico de barras para distribución de calificaciones
 */
export function MetricsCharts({ ratingData, volumeData, distributionData }: MetricsChartsProps) {
  // Transformar datos para cada gráfico
  const ratingOverTimeData = transformApiDataForChart(ratingData);
  const reviewVolumeData = transformApiDataForChart(volumeData);
  const ratingDistributionData = transformApiDataForChart(distributionData);

  /**
   * Componente personalizado para tooltips de gráficos
   * Muestra información detallada al pasar el cursor sobre los puntos de datos
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800">{`Fecha: ${label}`}</p>
          <div className="mt-2 space-y-1">
            {payload.map((pld: any) => (
              pld.value !== null && (
                <div key={pld.dataKey} className="flex items-center">
                  <div style={{ backgroundColor: pld.color }} className="w-3 h-3 rounded-full mr-2"></div>
                  <p className="text-sm text-gray-600">{`${pld.dataKey}: `}</p>
                  <p className="text-sm font-semibold ml-1">{`${pld.value.toFixed(2)} estrellas`}</p>
                </div>
              )
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Estado inicial: mostrar mensaje si no hay datos
  if (!ratingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Selecciona competidores para ver las métricas.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de tendencia de puntuación (ocupa 2 columnas en pantallas grandes) */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>📈 Tendencia de Puntuación a Largo Plazo</CardTitle>
          <CardDescription>
            Muestra la tendencia suavizada (media móvil de 10 años) de la puntuación promedio.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart 
              data={ratingOverTimeData} 
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={[1, 5]} 
                tickFormatter={(value) => `⭐ ${value}`} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
              
              {/* Renderizar líneas para cada dataset */}
              {(ratingData?.datasets || []).map((dataset) => (
                <Line 
                  key={dataset.label}
                  connectNulls={true} // Conectar puntos nulos para una línea continua
                  type="linear" 
                  dataKey={dataset.label} 
                  stroke={dataset.color}
                  strokeWidth={3} // Línea gruesa para mejor visibilidad
                  dot={false} // Ocultar puntos individuales
                  activeDot={{ r: 8, strokeWidth: 2 }} // Punto activo más grande al hacer hover
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Gráfico de volumen de reseñas */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Volumen de Reseñas por Mes</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              {(volumeData?.datasets || []).map((dataset) => (
                <Bar key={dataset.label} dataKey={dataset.label} fill={dataset.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Gráfico de distribución de calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>⭐ Distribución de Calificaciones (%)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend />
              {(distributionData?.datasets || []).map((dataset) => (
                <Bar key={dataset.label} dataKey={dataset.label} fill={dataset.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
