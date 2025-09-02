// En src/Dashboard.tsx (VERSIÓN FINAL)

import { useState } from 'react';
import { CompetitorSelector, Competitor } from './CompetitorSelector';
import { MetricsCharts } from './MetricsCharts';
import { AttributeAnalysis } from './AttributeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, Users, Star, BarChart3, Target, Loader2 } from 'lucide-react';
import { fetchCompareMetrics, fetchAttributeImpact, CompareData, ImpactData } from '../lib/api';

// Paleta de colores para los gráficos
const COLOR_PALETTE = [
  '#1e90ff', '#ff4500', '#32cd32', '#9370db', '#00ced1', '#ffa500',
];

export function Dashboard() {
  const businessId = "F5N-gTCaKg2gJHEbJcqmKA"; 
  const businessName = "Joe's Pizza";

  // Datos fijos para las tarjetas de resumen, como solicitaste.
  const businessSummary = {
    currentRating: 4.3,
    totalReviews: 324,
    rankingPosition: 2,
  };

  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);
  const [metricsData, setMetricsData] = useState<CompareData | null>(null);
  const [attributeData, setAttributeData] = useState<ImpactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Función que se ejecuta al hacer clic en el botón "Comparar"
  const handleCompare = async () => {
    if (selectedCompetitors.length === 0) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const competitorIds = selectedCompetitors.map(c => c.id).filter(id => id !== businessId);
      const allBusinessIds = [businessId, ...competitorIds];

      const compareResult = await fetchCompareMetrics(allBusinessIds);

      const assignColors = (chartData: any) => {
        if (!chartData || !chartData.datasets) return chartData;
        return {
          ...chartData,
          datasets: chartData.datasets.map((dataset: any, index: number) => ({
            ...dataset,
            color: COLOR_PALETTE[index % COLOR_PALETTE.length]
          }))
        };
      };

      setMetricsData({
        ratingOverTime: assignColors(compareResult.ratingOverTime),
        reviewsOverTime: assignColors(compareResult.reviewsOverTime),
        ratingDistribution: assignColors(compareResult.ratingDistribution),
      });

      const attributesToAnalyze = ["attributes.RestaurantsPriceRange2", "attributes.GoodForKids", "attributes.WiFi"];
      const impactResult = await fetchAttributeImpact(attributesToAnalyze);
      setAttributeData(impactResult);

    } catch (error) {
      console.error("Error al cargar los datos del dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Dashboard de Análisis Competitivo
          </h1>
        </div>
      </div>

      {/* Tarjetas de Resumen (con datos fijos por ahora) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Calificación Actual</CardTitle><Star className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{businessSummary.currentRating}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total de Reseñas</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{businessSummary.totalReviews}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Posición en Ranking</CardTitle><Target className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">#{businessSummary.rankingPosition}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Competidores Seleccionados</CardTitle><Building2 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{selectedCompetitors.length} / 5</div></CardContent></Card>
      </div>

      {/* Controles: Selector y Botón de Comparación */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <CompetitorSelector 
          selectedCompetitors={selectedCompetitors}
          onCompetitorsChange={setSelectedCompetitors}
        />
        <Button 
          onClick={handleCompare} 
          disabled={selectedCompetitors.length === 0 || isLoading}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Analizando...' : 'Comparar'}
        </Button>
      </div>

      {/* Contenido Principal (Gráficos y Análisis) */}
      {hasSearched && (
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metrics">📊 Métricas Comparativas</TabsTrigger>
            <TabsTrigger value="attributes">🎯 Análisis de Atributos</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="space-y-6">
            {isLoading ? (
              <p className="text-center py-10">Cargando métricas...</p>
            ) : (
              <MetricsCharts 
                ratingData={metricsData?.ratingOverTime}
                volumeData={metricsData?.reviewsOverTime}
                distributionData={metricsData?.ratingDistribution}
              />
            )}
          </TabsContent>

          <TabsContent value="attributes" className="space-y-6">
            {isLoading ? (
              <p className="text-center py-10">Cargando análisis...</p>
            ) : (
              <AttributeAnalysis attributeData={attributeData?.byAttribute} />
            )}
          </TabsContent>
        </Tabs>
      )}

      {!hasSearched && (
        <div className="text-center text-gray-500 mt-10 p-8 border-2 border-dashed rounded-lg">
          <p>Selecciona tus competidores y haz clic en "Comparar" para iniciar el análisis.</p>
        </div>
      )}
    </div>
  );
}