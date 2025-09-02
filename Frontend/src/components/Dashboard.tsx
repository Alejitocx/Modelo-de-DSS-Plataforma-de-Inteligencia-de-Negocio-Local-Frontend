// En src/Dashboard.tsx (VERSIÓN FINAL CON TARJETAS DINÁMICAS RESTAURADAS)

import { useState, useEffect } from 'react';
import { CompetitorSelector, Competitor } from './CompetitorSelector';
import { MetricsCharts } from './MetricsCharts';
import { AttributeAnalysis } from './AttributeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, Users, Star, BarChart3, Target, Loader2 } from 'lucide-react';
import { fetchCompareMetrics, fetchAttributeImpact, fetchKpi, CompareData, ImpactData } from '../lib/api'; // Importamos fetchKpi

const COLOR_PALETTE = ['#1e90ff', '#ff4500', '#32cd32', '#9370db', '#00ced1', '#ffa500'];

export function Dashboard() {
  const businessId = "F5N-gTCaKg2gJHEbJcqmKA"; 
  const businessName = "Joe's Pizza";

  // --- ESTADOS RESTAURADOS PARA LAS TARJETAS ---
  const [summaryData, setSummaryData] = useState({ rating: 0, reviewCount: 0 });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  // --- FIN DE ESTADOS RESTAURADOS ---

  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);
  const [metricsData, setMetricsData] = useState<CompareData | null>(null);
  const [attributeData, setAttributeData] = useState<ImpactData | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- useEffect RESTAURADO PARA CARGAR LOS DATOS DE LAS TARJETAS ---
  // Esta lógica se ejecuta de forma independiente y solo una vez al cargar la página.
  useEffect(() => {
    const loadSummaryData = async () => {
      setIsLoadingSummary(true);
      try {
        const [ratingResponse, countResponse] = await Promise.all([
          fetchKpi({ collection: 'resenas', op: 'avg', valueField: 'stars', match: { business_id: businessId } }),
          fetchKpi({ collection: 'resenas', op: 'count', match: { business_id: businessId } })
        ]);
        setSummaryData({
          rating: parseFloat(ratingResponse.value.toFixed(1)),
          reviewCount: countResponse.value,
        });
      } catch (error) {
        console.error("Error al cargar los datos de resumen:", error);
      } finally {
        setIsLoadingSummary(false);
      }
    };
    loadSummaryData();
  }, [businessId]);
  // --- FIN DEL useEffect RESTAURADO ---

  // La función handleCompare se mantiene exactamente igual, no se toca.
  const handleCompare = async () => {
    if (selectedCompetitors.length === 0) return;
    setIsLoadingCompare(true);
    setHasSearched(true);
    try {
      const competitorIds = selectedCompetitors.map(c => c.id).filter(id => id !== businessId);
      const allBusinessIds = [businessId, ...competitorIds];
      const compareResult = await fetchCompareMetrics(allBusinessIds);
      const assignColors = (chartData: any) => {
        if (!chartData || !chartData.datasets) return chartData;
        return { ...chartData, datasets: chartData.datasets.map((d: any, i: number) => ({ ...d, color: COLOR_PALETTE[i % COLOR_PALETTE.length] })) };
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
      setIsLoadingCompare(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg"><BarChart3 className="h-8 w-8 text-white" /></div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dashboard de Análisis Competitivo</h1>
        </div>
      </div>

      {/* --- TARJETAS DE RESUMEN CONECTADAS A LOS NUEVOS ESTADOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader><CardTitle className="text-sm font-medium">⭐ Calificación Actual</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.rating}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">👥 Total de Reseñas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.reviewCount}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">🏢 Competidores Seleccionados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{selectedCompetitors.length} / 5</div></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <CompetitorSelector selectedCompetitors={selectedCompetitors} onCompetitorsChange={setSelectedCompetitors} />
        <Button onClick={handleCompare} disabled={selectedCompetitors.length === 0 || isLoadingCompare}>
          {isLoadingCompare ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoadingCompare ? 'Analizando...' : 'Comparar'}
        </Button>
      </div>

      {hasSearched && (
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="metrics">📊 Métricas Comparativas</TabsTrigger><TabsTrigger value="attributes">🎯 Análisis de Atributos</TabsTrigger></TabsList>
          <TabsContent value="metrics" className="space-y-6">
            {isLoadingCompare ? <p className="text-center py-10">Cargando métricas...</p> : <MetricsCharts ratingData={metricsData?.ratingOverTime} volumeData={metricsData?.reviewsOverTime} distributionData={metricsData?.ratingDistribution} />}
          </TabsContent>
          <TabsContent value="attributes" className="space-y-6">
            {isLoadingCompare ? <p className="text-center py-10">Cargando análisis...</p> : <AttributeAnalysis attributeData={attributeData?.byAttribute} />}
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