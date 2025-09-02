// AttributeAnalysis.tsx (CORREGIDO)

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { AttributeCorrelation } from '../lib/api';

interface AttributeAnalysisProps {
  attributeData?: AttributeCorrelation[];
}

export function AttributeAnalysis({ attributeData = [] }: AttributeAnalysisProps) {
  const attributeCorrelations = attributeData
    .filter(attr => attr.value !== null)
    .slice(0, 10)
    .map(attr => ({
      attribute: `${attr.key.replace("attributes.", "")}: ${attr.value}`, // Limpiamos el nombre
      impact: attr.avgStars > 4.0 ? 'positive' : 'negative',
      avgRating: attr.avgStars,
      businesses: attr.count,
      description: `El valor '${attr.value}' para '${attr.key.replace("attributes.", "")}' tiene una calificación promedio de ${attr.avgStars.toFixed(2)} estrellas en ${attr.count} reseñas.`
    }))
    .sort((a, b) => b.avgRating - a.avgRating);

  if (attributeData.length === 0) {
      return (
          <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                  <p>Cargando datos de análisis o no hay datos para mostrar.</p>
              </CardContent>
          </Card>
      );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            📊 Análisis de Atributos - Correlación con Calificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={attributeCorrelations} layout="vertical" margin={{ top: 5, right: 20, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.2)" />
              <XAxis type="number" domain={['dataMin - 0.2', 'dataMax + 0.1']} stroke="#4a90e2" />
              <YAxis dataKey="attribute" type="category" width={150} stroke="#4a90e2" tick={{ fontSize: 12 }} />
              <Tooltip 
                formatter={(value) => `${Number(value).toFixed(2)} estrellas`} 
                cursor={{ fill: 'rgba(74, 144, 226, 0.1)' }}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="avgRating" radius={[0, 6, 6, 0]}>
                {/* El componente <Cell> se usa aquí para aplicar un color a cada barra individualmente */}
                {attributeCorrelations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.impact === 'positive' ? '#4dabf7' : '#ff8a8a'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            💡 Insights y Recomendaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {attributeCorrelations.map(attr => (
            <div key={attr.attribute} className="flex items-start gap-3 p-4 rounded-xl border">
              <div className={`p-1 rounded-full ${attr.impact === 'positive' ? 'bg-green-100' : 'bg-red-100'}`}>
                {attr.impact === 'positive' ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
              </div>
              <div className="flex-1">
                <span className="font-medium text-gray-800">{attr.attribute}</span>
                <Badge variant={attr.impact === 'positive' ? 'default' : 'destructive'} className="ml-2">{attr.avgRating.toFixed(2)} ⭐</Badge>
                <p className="text-sm text-muted-foreground mt-1">{attr.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}