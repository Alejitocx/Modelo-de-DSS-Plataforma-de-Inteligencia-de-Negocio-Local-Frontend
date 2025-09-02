import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, Zap, Target, Shield } from 'lucide-react';

interface AttributeAnalysisProps {
  businessName: string;
}

// Datos simulados de análisis de atributos
const attributeCorrelations = [
  {
    attribute: 'Música de ambiente',
    impact: 'positive',
    avgRating: 4.3,
    businesses: 12,
    description: 'Los negocios con música de ambiente tienen calificaciones 15% más altas'
  },
  {
    attribute: 'Ambiente ruidoso',
    impact: 'negative',
    avgRating: 3.7,
    businesses: 8,
    description: 'Los negocios con ambiente ruidoso tienen calificaciones 12% más bajas'
  },
  {
    attribute: 'Servicio rápido',
    impact: 'positive',
    avgRating: 4.4,
    businesses: 15,
    description: 'El servicio rápido mejora las calificaciones en un 18%'
  },
  {
    attribute: 'Precios altos',
    impact: 'negative',
    avgRating: 3.9,
    businesses: 6,
    description: 'Los precios altos correlacionan con calificaciones 8% menores'
  },
  {
    attribute: 'Ubicación céntrica',
    impact: 'positive',
    avgRating: 4.2,
    businesses: 20,
    description: 'La ubicación céntrica aumenta las calificaciones en un 10%'
  },
  {
    attribute: 'Estacionamiento disponible',
    impact: 'positive',
    avgRating: 4.1,
    businesses: 9,
    description: 'El estacionamiento disponible mejora la experiencia del cliente'
  }
];

const businessAttributes = [
  { name: 'Música de ambiente', hasAttribute: true, impact: 'positive' },
  { name: 'Servicio rápido', hasAttribute: true, impact: 'positive' },
  { name: 'Ubicación céntrica', hasAttribute: true, impact: 'positive' },
  { name: 'Estacionamiento disponible', hasAttribute: false, impact: 'positive' },
  { name: 'Ambiente ruidoso', hasAttribute: false, impact: 'negative' },
  { name: 'Precios altos', hasAttribute: false, impact: 'negative' },
];

export function AttributeAnalysis({ businessName }: AttributeAnalysisProps) {
  const positiveAttributes = businessAttributes.filter(attr => attr.hasAttribute && attr.impact === 'positive');
  const missingPositiveAttributes = businessAttributes.filter(attr => !attr.hasAttribute && attr.impact === 'positive');
  const avoidedNegativeAttributes = businessAttributes.filter(attr => !attr.hasAttribute && attr.impact === 'negative');

  return (
    <div className="space-y-6">
      {/* Análisis General de Atributos */}
      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <BarChart className="h-6 w-6 text-blue-600" />
            📊 Análisis de Atributos - Correlación con Calificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={attributeCorrelations} layout="horizontal">
              <defs>
                <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#74c0fc" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.9}/>
                  <stop offset="95%" stopColor="#ff8a8a" stopOpacity={0.6}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 144, 226, 0.2)" />
              <XAxis type="number" domain={[3.5, 4.5]} stroke="#4a90e2" />
              <YAxis dataKey="attribute" type="category" width={120} stroke="#4a90e2" />
              <Tooltip 
                formatter={(value, name) => [`${value} estrellas`, 'Calificación Promedio']}
                labelFormatter={(label) => `Atributo: ${label}`}
                contentStyle={{
                  backgroundColor: 'rgba(255,255,255,0.98)',
                  border: '1px solid rgba(74, 144, 226, 0.2)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(74, 144, 226, 0.1), 0 10px 10px -5px rgba(74, 144, 226, 0.04)'
                }}
              />
              <Bar 
                dataKey="avgRating" 
                fill={(entry) => entry.impact === 'positive' ? 'url(#positiveGradient)' : 'url(#negativeGradient)'}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Estado Actual del Negocio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-0 backdrop-blur-sm bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 shadow-md">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                ✨ Fortalezas Actuales
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {positiveAttributes.map(attr => (
              <Badge 
                key={attr.name} 
                variant="secondary" 
                className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 border border-cyan-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {attr.name}
              </Badge>
            ))}
            {positiveAttributes.length === 0 && (
              <p className="text-sm text-muted-foreground">No se han identificado fortalezas específicas</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-blue-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-500 shadow-md">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                🎯 Oportunidades de Mejora
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingPositiveAttributes.map(attr => (
              <Badge 
                key={attr.name} 
                variant="outline" 
                className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {attr.name}
              </Badge>
            ))}
            {missingPositiveAttributes.length === 0 && (
              <p className="text-sm text-muted-foreground">Tienes todos los atributos positivos</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 backdrop-blur-sm bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-500 shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                🛡️ Riesgos Evitados
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {avoidedNegativeAttributes.map(attr => (
              <Badge 
                key={attr.name} 
                variant="secondary" 
                className="bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 border border-teal-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {attr.name}
              </Badge>
            ))}
            {avoidedNegativeAttributes.length === 0 && (
              <p className="text-sm text-muted-foreground">Hay riesgos que podrías estar enfrentando</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones Detalladas */}
      <Card className="shadow-lg border border-blue-100 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-xl border-b border-blue-100">
          <CardTitle className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-sky-600" />
            💡 Insights y Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {attributeCorrelations.map(attr => (
            <div 
              key={attr.attribute} 
              className="flex items-start gap-3 p-4 rounded-xl border border-blue-100 shadow-md bg-gradient-to-r from-white to-blue-50/30 backdrop-blur-sm hover:shadow-lg transition-all duration-200"
            >
              <div className={`p-2 rounded-lg shadow-sm ${attr.impact === 'positive' 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
                : 'bg-gradient-to-r from-red-400 to-pink-500'
              }`}>
                {attr.impact === 'positive' ? (
                  <TrendingUp className="h-5 w-5 text-white" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-lg text-gray-800">{attr.attribute}</span>
                  <Badge 
                    variant={attr.impact === 'positive' ? 'default' : 'destructive'}
                    className={attr.impact === 'positive' 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-sm' 
                      : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-sm'
                    }
                  >
                    {attr.avgRating} ⭐
                  </Badge>
                  <span className="text-sm text-muted-foreground bg-blue-100 px-3 py-1 rounded-full">
                    📊 {attr.businesses} negocios analizados
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{attr.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}