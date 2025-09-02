import { useState } from 'react';
import { CompetitorSelector, Competitor } from './CompetitorSelector';
import { MetricsCharts } from './MetricsCharts';
import { AttributeAnalysis } from './AttributeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Building2, Users, Star, TrendingUp, BarChart3, Target } from 'lucide-react';

export function Dashboard() {
  // Preseleccionar algunos competidores para el mockup
  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([
    { id: '1', name: 'Restaurante El Buen Sabor', category: 'Restaurante', area: 'Centro' },
    { id: '2', name: 'La Parrilla Dorada', category: 'Restaurante', area: 'Centro' },
    { id: '3', name: 'Café Aromático', category: 'Cafetería', area: 'Centro' },
  ]);
  
  const businessName = "Mi Negocio";

  // Datos simulados del resumen del negocio
  const businessSummary = {
    currentRating: 4.3,
    totalReviews: 324,
    monthlyReviews: 55,
    rankingPosition: 2,
    totalCompetitors: 23
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header con gradiente azul pastel */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Dashboard de Análisis Competitivo
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          🚀 Compara tu rendimiento con hasta 5 competidores directos y descubre oportunidades de mejora con insights basados en datos
        </p>
      </div>

      {/* Resumen del Negocio con gradientes azul pastel mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-xl border-0 backdrop-blur-sm bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">⭐ Calificación Actual</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-1">
              {businessSummary.currentRating}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +0.2 desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">👥 Total de Reseñas</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              {businessSummary.totalReviews}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +{businessSummary.monthlyReviews} este mes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">🏆 Posición en Ranking</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
              #{businessSummary.rankingPosition}
            </div>
            <p className="text-xs text-muted-foreground">
              de {businessSummary.totalCompetitors} en tu área
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 backdrop-blur-sm bg-gradient-to-br from-indigo-50 to-purple-50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-gray-700">🏢 Competidores Activos</CardTitle>
            <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 shadow-lg">
              <Building2 className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              {selectedCompetitors.length}
            </div>
            <p className="text-xs text-muted-foreground">
              de 5 máximo seleccionados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selector de Competidores */}
      <div className="mb-8">
        <CompetitorSelector 
          selectedCompetitors={selectedCompetitors}
          onCompetitorsChange={setSelectedCompetitors}
        />
      </div>

      {/* Contenido Principal */}
      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-blue-100 to-cyan-100 border-0 shadow-lg">
          <TabsTrigger 
            value="metrics" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            📊 Métricas Comparativas
          </TabsTrigger>
          <TabsTrigger 
            value="attributes"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            🎯 Análisis de Atributos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          <MetricsCharts 
            selectedCompetitors={selectedCompetitors}
            businessName={businessName}
          />
        </TabsContent>

        <TabsContent value="attributes" className="space-y-6">
          <AttributeAnalysis businessName={businessName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}