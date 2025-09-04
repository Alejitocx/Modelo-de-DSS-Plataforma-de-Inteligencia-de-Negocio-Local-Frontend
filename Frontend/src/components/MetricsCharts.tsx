import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartDataset { label: string; data: (number | null)[]; color: string; }
interface ChartData { labels: string[]; datasets: ChartDataset[]; }
interface MetricsChartsProps { ratingData?: ChartData; volumeData?: ChartData; distributionData?: ChartData; }

const transformApiDataForChart = (apiData?: ChartData) => {
  if (!apiData || !apiData.labels || !apiData.datasets) return [];
  const { labels, datasets } = apiData;
  return labels.map((label, index) => {
    const dataPoint: { [key: string]: any } = { name: label };
    datasets.forEach(dataset => { dataPoint[dataset.label] = dataset.data[index]; });
    return dataPoint;
  });
};

export function MetricsCharts({ ratingData, volumeData, distributionData }: MetricsChartsProps) {
  const ratingOverTimeData = transformApiDataForChart(ratingData);
  const reviewVolumeData = transformApiDataForChart(volumeData);
  const ratingDistributionData = transformApiDataForChart(distributionData);

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

  if (!ratingData) {
    return <div className="flex justify-center items-center h-64"><p>Selecciona competidores para ver las métricas.</p></div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>📈 Tendencia de Puntuación a Largo Plazo</CardTitle>
          {/* CAMBIO: Se actualiza la descripción para reflejar el único dato visible. */}
          <CardDescription>
            Muestra la tendencia suavizada (media móvil de 10 años) de la puntuación promedio.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={ratingOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} domain={[1, 5]} tickFormatter={(value) => `⭐ ${value}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />
              
              {/* CAMBIO: Se simplifica la lógica. Todas las líneas son sólidas y gruesas. */}
              {(ratingData?.datasets || []).map((dataset) => (
                <Line 
                  key={dataset.label}
                  connectNulls={true} // Se recomienda conectar nulos para una media móvil
                  type="linear" 
                  dataKey={dataset.label} 
                  stroke={dataset.color}
                  strokeWidth={3} // Línea siempre gruesa
                  dot={false}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>📊 Volumen de Reseñas por Mes</CardTitle></CardHeader>
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
      <Card>
        <CardHeader><CardTitle>⭐ Distribución de Calificaciones (%)</CardTitle></CardHeader>
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