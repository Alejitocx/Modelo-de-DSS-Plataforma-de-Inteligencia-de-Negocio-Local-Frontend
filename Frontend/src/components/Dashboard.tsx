import { useState, useEffect } from 'react';
import { CompetitorSelector, Competitor } from './CompetitorSelector';
import { MetricsCharts } from './MetricsCharts';
import { AttributeAnalysis } from './AttributeAnalysis';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Building2, Users, Star, BarChart3, Loader2 } from 'lucide-react';
import { fetchCompareMetrics, fetchBusinessAttributes, fetchKpi, CompareData } from '../lib/api';

const COLOR_PALETTE = ['#00f5d4', '#ff4500', '#32cd32', '#9370db', '#00ced1', '#f1fa8c'];

export function Dashboard() {
  const businessId = "F5N-gTCaKg2gJHEbJcqmKA"; 
  const businessName = "Joe's Pizza";

  const [summaryData, setSummaryData] = useState({ rating: 0, reviewCount: 0 });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);
  const [metricsData, setMetricsData] = useState<CompareData | null>(null);
  const [attributeData, setAttributeData] = useState<any[] | null>(null);
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

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

  const handleCompare = async () => {
    if (selectedCompetitors.length === 0) return;
    setIsLoadingCompare(true);
    setHasSearched(true);
    try {
      const competitorIds = selectedCompetitors.map(c => c.id).filter(id => id !== businessId);
      const allBusinessIds = [businessId, ...competitorIds];
      
      const [compareResult, attributesResult] = await Promise.all([
        fetchCompareMetrics(allBusinessIds),
        fetchBusinessAttributes(allBusinessIds)
      ]);

      const assignColors = (chartData: any) => {
        if (!chartData || !chartData.datasets) return chartData;
        return { ...chartData, datasets: chartData.datasets.map((d: any, i: number) => ({ ...d, color: COLOR_PALETTE[i % COLOR_PALETTE.length] })) };
      };
      setMetricsData({
        ratingOverTime: assignColors(compareResult.ratingOverTime),
        reviewsOverTime: assignColors(compareResult.reviewsOverTime),
        ratingDistribution: assignColors(compareResult.ratingDistribution),
      });
      setAttributeData(attributesResult);
    } catch (error) {
      console.error("Error al cargar los datos del dashboard:", error);
    } finally {
      setIsLoadingCompare(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header con efecto neón */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20">
            <BarChart3 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary drop-shadow-[0_0_8px_hsl(var(--primary))]">
            Dashboard de Análisis Competitivo
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader><CardTitle className="text-sm font-medium text-primary/80">⭐ Calificación Actual</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.rating}</div></CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader><CardTitle className="text-sm font-medium text-primary/80">👥 Total de Reseñas</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.reviewCount}</div></CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
          <CardHeader><CardTitle className="text-sm font-medium text-primary/80">🏢 Competidores Seleccionados</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{selectedCompetitors.length} / 5</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end mb-8 p-4 border border-primary/20 rounded-lg bg-card/80 backdrop-blur-sm shadow-md shadow-primary/10">
        <CompetitorSelector selectedCompetitors={selectedCompetitors} onCompetitorsChange={setSelectedCompetitors} />
        <Button onClick={handleCompare} disabled={selectedCompetitors.length === 0 || isLoadingCompare} variant="outline" className="border-primary text-primary hover:bg-primary/20 hover:text-primary">
          {isLoadingCompare ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoadingCompare ? 'Analizando...' : 'Comparar'}
        </Button>
      </div>

      {}
      {hasSearched && (
        <Tabs defaultValue="metrics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="metrics" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
              📊 Métricas Comparativas
            </TabsTrigger>
            <TabsTrigger value="attributes" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:shadow-primary/20">
              🎯 Análisis de Atributos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="metrics" className="space-y-6">
            {isLoadingCompare ? <p className="text-center py-10">Cargando métricas...</p> : <MetricsCharts ratingData={metricsData?.ratingOverTime} volumeData={metricsData?.reviewsOverTime} distributionData={metricsData?.ratingDistribution} />}
          </TabsContent>
          
          <TabsContent value="attributes" className="space-y-6">
            {isLoadingCompare ? <p className="text-center py-10">Cargando análisis...</p> : <AttributeAnalysis businessData={attributeData} />}
          </TabsContent>
        </Tabs>
      )}

      {!hasSearched && (
        <div className="text-center text-muted-foreground mt-10 p-8 border-2 border-dashed border-primary/30 rounded-lg">
          <p>Selecciona tus competidores y haz clic en "Comparar" para iniciar el análisis.</p>
        </div>
      )}
    </div>
  );
}