import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Competitor } from './CompetitorSelector';

interface MetricsChartsProps {
  selectedCompetitors: Competitor[];
  businessName: string;
}

// Datos simulados para el gráfico de puntuación promedio a lo largo del tiempo
const ratingOverTimeData = [
  { month: 'Ene', 'Mi Negocio': 4.2, 'Restaurante El Buen Sabor': 4.1, 'La Parrilla Dorada': 3.8, 'Café Aromático': 4.5, 'Pizza Suprema': 3.9, 'Sushi Zen': 4.3 },
  { month: 'Feb', 'Mi Negocio': 4.3, 'Restaurante El Buen Sabor': 4.0, 'La Parrilla Dorada': 3.9, 'Café Aromático': 4.4, 'Pizza Suprema': 4.0, 'Sushi Zen': 4.2 },
  { month: 'Mar', 'Mi Negocio': 4.1, 'Restaurante El Buen Sabor': 4.2, 'La Parrilla Dorada': 4.0, 'Café Aromático': 4.3, 'Pizza Suprema': 4.1, 'Sushi Zen': 4.4 },
  { month: 'Abr', 'Mi Negocio': 4.4, 'Restaurante El Buen Sabor': 4.1, 'La Parrilla Dorada': 4.1, 'Café Aromático': 4.6, 'Pizza Suprema': 3.8, 'Sushi Zen': 4.3 },
  { month: 'May', 'Mi Negocio': 4.5, 'Restaurante El Buen Sabor': 4.3, 'La Parrilla Dorada': 4.2, 'Café Aromático': 4.5, 'Pizza Suprema': 4.2, 'Sushi Zen': 4.5 },
  { month: 'Jun', 'Mi Negocio': 4.3, 'Restaurante El Buen Sabor': 4.2, 'La Parrilla Dorada': 4.0, 'Café Aromático': 4.4, 'Pizza Suprema': 4.0, 'Sushi Zen': 4.4 },
];

// Datos simulados para volumen de reseñas por mes
const reviewVolumeData = [
  { month: 'Ene', 'Mi Negocio': 45, 'Restaurante El Buen Sabor': 38, 'La Parrilla Dorada': 52, 'Café Aromático': 23, 'Pizza Suprema': 67, 'Sushi Zen': 29 },
  { month: 'Feb', 'Mi Negocio': 52, 'Restaurante El Buen Sabor': 41, 'La Parrilla Dorada': 48, 'Café Aromático': 31, 'Pizza Suprema': 71, 'Sushi Zen': 33 },
  { month: 'Mar', 'Mi Negocio': 48, 'Restaurante El Buen Sabor': 45, 'La Parrilla Dorada': 55, 'Café Aromático': 28, 'Pizza Suprema': 63, 'Sushi Zen': 37 },
  { month: 'Abr', 'Mi Negocio': 61, 'Restaurante El Buen Sabor': 52, 'La Parrilla Dorada': 49, 'Café Aromático': 35, 'Pizza Suprema': 69, 'Sushi Zen': 41 },
  { month: 'May', 'Mi Negocio': 58, 'Restaurante El Buen Sabor': 49, 'La Parrilla Dorada': 53, 'Café Aromático': 32, 'Pizza Suprema': 74, 'Sushi Zen': 38 },
  { month: 'Jun', 'Mi Negocio': 55, 'Restaurante El Buen Sabor': 46, 'La Parrilla Dorada': 51, 'Café Aromático': 29, 'Pizza Suprema': 68, 'Sushi Zen': 35 },
];

// Datos simulados para distribución de calificaciones
const ratingDistributionData = [
  { name: '5 Estrellas', 'Mi Negocio': 65, 'Restaurante El Buen Sabor': 58, 'La Parrilla Dorada': 45, 'Café Aromático': 72, 'Pizza Suprema': 52, 'Sushi Zen': 68 },
  { name: '4 Estrellas', 'Mi Negocio': 22, 'Restaurante El Buen Sabor': 25, 'La Parrilla Dorada': 30, 'Café Aromático': 20, 'Pizza Suprema': 28, 'Sushi Zen': 23 },
  { name: '3 Estrellas', 'Mi Negocio': 8, 'Restaurante El Buen Sabor': 12, 'La Parrilla Dorada': 15, 'Café Aromático': 5, 'Pizza Suprema': 13, 'Sushi Zen': 6 },
  { name: '2 Estrellas', 'Mi Negocio': 3, 'Restaurante El Buen Sabor': 3, 'La Parrilla Dorada': 6, 'Café Aromático': 2, 'Pizza Suprema': 4, 'Sushi Zen': 2 },
  { name: '1 Estrella', 'Mi Negocio': 2, 'Restaurante El Buen Sabor': 2, 'La Parrilla Dorada': 4, 'Café Aromático': 1, 'Pizza Suprema': 3, 'Sushi Zen': 1 },
];

// Paleta de colores azul pastel y tonos complementarios
const colors = [
  '#4dabf7', // Azul pastel principal (Mi Negocio)
  '#74c0fc', // Azul claro pastel
  '#339af0', // Azul medio
  '#c5f6fa', // Cyan muy claro
  '#a5d8ff', // Azul muy claro
  '#1c7ed6', // Azul profundo
  '#91d5ff', // Azul cielo pastel
  '#bae7ff', // Azul hielo
];

export function MetricsCharts({ selectedCompetitors, businessName }: MetricsChartsProps) {
  const displayNames = [businessName, ...selectedCompetitors.map(c => c.name)];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Puntuación Promedio a lo Largo del Tiempo */}
      <Card className="lg:col-span-2 shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            📈 Puntuación Promedio a lo Largo del Tiempo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ratingOverTimeData}>
              <defs>
                <linearGradient id="lineGradient1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.2)" />
              <XAxis dataKey="month" stroke="#4a90e2" />
              <YAxis domain={[3.5, 5]} stroke="#4a90e2" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(74, 144, 226, 0.1), 0 10px 10px -5px rgba(74, 144, 226, 0.04)'
                }}
              />
              <Legend />
              {displayNames.map((name, index) => (
                <Line 
                  key={name}
                  type="monotone" 
                  dataKey={name} 
                  stroke={colors[index % colors.length]}
                  strokeWidth={index === 0 ? 4 : 3}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: colors[index % colors.length], strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volumen de Reseñas por Mes */}
      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            📊 Volumen de Reseñas por Mes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewVolumeData}>
              <defs>
                {colors.map((color, index) => (
                  <linearGradient key={index} id={`barGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.2)" />
              <XAxis dataKey="month" stroke="#4a90e2" />
              <YAxis stroke="#4a90e2" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(74, 144, 226, 0.1), 0 10px 10px -5px rgba(74, 144, 226, 0.04)'
                }}
              />
              <Legend />
              {displayNames.map((name, index) => (
                <Bar 
                  key={name}
                  dataKey={name} 
                  fill={`url(#barGradient${index})`}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Distribución de Calificaciones */}
      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            ⭐ Distribución de Calificaciones (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistributionData} layout="horizontal">
              <defs>
                {colors.map((color, index) => (
                  <linearGradient key={index} id={`horizontalGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor={color} stopOpacity={0.9}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.6}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.2)" />
              <XAxis type="number" stroke="#4a90e2" />
              <YAxis dataKey="name" type="category" width={80} stroke="#4a90e2" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(74, 144, 226, 0.1), 0 10px 10px -5px rgba(74, 144, 226, 0.04)'
                }}
              />
              <Legend />
              {displayNames.map((name, index) => (
                <Bar 
                  key={name}
                  dataKey={name} 
                  fill={`url(#horizontalGradient${index})`}
                  radius={[0, 4, 4, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}