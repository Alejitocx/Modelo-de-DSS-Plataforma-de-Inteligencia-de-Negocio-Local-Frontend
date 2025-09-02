// En src/MetricsCharts.tsx (MODIFICADO Y REFINADO)

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Definimos una interfaz más completa para nuestros datasets
interface ChartDataset {
  label: string;
  data: number[];
  color: string; // El color ahora es una propiedad del dataset
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface MetricsChartsProps {
  ratingData?: ChartData;
  volumeData?: ChartData;
  distributionData?: ChartData;
}

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

export function MetricsCharts({ ratingData, volumeData, distributionData }: MetricsChartsProps) {
  const ratingOverTimeData = transformApiDataForChart(ratingData);
  const reviewVolumeData = transformApiDataForChart(volumeData);
  const ratingDistributionData = transformApiDataForChart(distributionData);

  if (!ratingData) {
    return <div className="flex justify-center items-center h-64"><p>Selecciona competidores para ver las métricas.</p></div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Puntuación Promedio a lo Largo del Tiempo */}
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>📈 Puntuación Promedio a lo Largo del Tiempo</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              {/* Iteramos sobre los datasets de este gráfico específico */}
              {(ratingData?.datasets || []).map((dataset) => (
                <Line 
                  key={dataset.label}
                  type="monotone" 
                  dataKey={dataset.label} 
                  stroke={dataset.color} // Usamos el color que viene en los datos
                  strokeWidth={dataset.label === "Mi Negocio" ? 3 : 2} // Línea más gruesa para tu negocio
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volumen de Reseñas por Mes */}
      <Card>
        <CardHeader><CardTitle>📊 Volumen de Reseñas por Mes</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Hacemos el map sobre los datos de este gráfico específico para asegurar consistencia */}
              {(volumeData?.datasets || []).map((dataset) => (
                <Bar key={dataset.label} dataKey={dataset.label} fill={dataset.color} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución de Calificaciones */}
      <Card>
        <CardHeader><CardTitle>⭐ Distribución de Calificaciones (%)</CardTitle></CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {/* Hacemos el map sobre los datos de este gráfico específico para asegurar consistencia */}
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