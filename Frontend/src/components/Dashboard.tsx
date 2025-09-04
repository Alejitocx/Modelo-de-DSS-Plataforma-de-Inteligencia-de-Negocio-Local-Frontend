import { useState, useEffect } from 'react';
import { CompetitorSelector, Competitor } from './CompetitorSelector';
import { MetricsCharts } from './MetricsCharts';
import { AttributeAnalysis } from './AttributeAnalysis';
import { JsonUploader } from './JsonUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, Loader2 } from 'lucide-react';
import { fetchCompareMetrics, fetchBusinessAttributes, fetchKpi, CompareData } from '../lib/api';
import { Slider } from './ui/slider'; 
import { calculateMovingAverage } from '../lib/calculateMovingAverage'; 
// Se importa la nueva sección de ayuda en lugar del botón
import { HelpSection } from './DashboardHelpButton';

const COLOR_PALETTE = ['#1e90ff', '#ff4500', '#32cd32', '#9370db', '#00ced1', '#ffa500'];

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

  const [movingAverageWindow, setMovingAverageWindow] = useState(3);
  const [processedMetricsData, setProcessedMetricsData] = useState<CompareData | null>(null);

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
      } catch (error) { console.error("Error al cargar datos de resumen:", error); } 
      finally { setIsLoadingSummary(false); }
    };
    loadSummaryData();
  }, [businessId]);

  useEffect(() => {
    if (!metricsData) return;

    const newProcessedData = JSON.parse(JSON.stringify(metricsData));

    if (newProcessedData.ratingOverTime && newProcessedData.ratingOverTime.datasets) {
      const originalDatasets = [...newProcessedData.ratingOverTime.datasets];
      newProcessedData.ratingOverTime.datasets = [];

      originalDatasets.forEach(dataset => {
        newProcessedData.ratingOverTime.datasets.push({ ...dataset });

        if (movingAverageWindow > 1) {
          const movingAverageData = calculateMovingAverage(dataset.data, movingAverageWindow);
          newProcessedData.ratingOverTime.datasets.push({
            ...dataset,
            label: `${dataset.label} (Media Móvil)`,
            data: movingAverageData,
          });
        }
      });
    }
    
    setProcessedMetricsData(newProcessedData);
  }, [metricsData, movingAverageWindow]);

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
    } catch (error) { console.error("Error al cargar datos del dashboard:", error); } 
    finally { setIsLoadingCompare(false); }
  };

   return ( 
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg"><BarChart3 className="h-8 w-8 text-white" /></div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Dashboard de Análisis Competitivo</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader><CardTitle className="text-sm font-medium">⭐ Calificación Actual</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.rating}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">👥 Total de Reseñas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryData.reviewCount}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">🏢 Competidores Seleccionados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{selectedCompetitors.length} / 5</div></CardContent></Card>
      </div>

      {/* Contenedor grid para controlar el espaciado entre las pestañas y la ayuda */}
      <div className="grid grid-rows-auto gap-16">

        {/* Elemento 1: Las Pestañas */}
        <Tabs defaultValue="compare" className="space-y-6">
          <TabsList className="flex w-full">
            <TabsTrigger value="compare" className="flex-1">📊 Métricas Comparativas</TabsTrigger>
            <TabsTrigger value="attributes" className="flex-1">🎯 Análisis de Atributos</TabsTrigger>
            <TabsTrigger value="admin" className="flex-1">⚙️ Administración</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compare">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-end p-4 border rounded-lg bg-white shadow-sm">
              <CompetitorSelector selectedCompetitors={selectedCompetitors} onCompetitorsChange={setSelectedCompetitors} />
              <Button onClick={handleCompare} disabled={selectedCompetitors.length === 0 || isLoadingCompare}>
                {isLoadingCompare ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoadingCompare ? 'Analizando...' : 'Comparar'}
              </Button>
            </div>
            
            {hasSearched && !isLoadingCompare && (
              <Card className="mt-6 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label htmlFor="ma-slider" className="text-sm font-medium shrink-0">Suavizar tendencia (Media Móvil):</label>
                  <Slider
                    id="ma-slider"
                    value={[movingAverageWindow]}
                    onValueChange={(value) => setMovingAverageWindow(value[0])}
                    min={1}
                    max={12}
                    step={1}
                    className="w-full sm:w-[200px]"
                  />
                  <span className="text-sm font-semibold w-full sm:w-24 text-left sm:text-right">
                    {movingAverageWindow === 1 ? 'Desactivado' : `${movingAverageWindow} meses`}
                  </span>
                </div>
              </Card>
            )}

            <div className="mt-6">
              {hasSearched ? (
                isLoadingCompare ? <p className="text-center py-10">Cargando métricas...</p> : 
                <MetricsCharts 
                  ratingData={processedMetricsData?.ratingOverTime} 
                  volumeData={metricsData?.reviewsOverTime} 
                  distributionData={metricsData?.ratingDistribution} 
                />
              ) : (
                <div className="text-center text-gray-500 p-8 border-2 border-dashed rounded-lg">
                  <p>Selecciona tus competidores y haz clic en "Comparar" para iniciar el análisis.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attributes">
            {hasSearched ? ( isLoadingCompare ? <p className="text-center py-10">Cargando análisis...</p> : <AttributeAnalysis businessData={attributeData} /> ) : ( <div className="text-center text-gray-500 mt-10 p-8 border-2 border-dashed rounded-lg"> <p>Primero realiza una comparación para ver el análisis de atributos.</p> </div> )}
          </TabsContent>
          <TabsContent value="admin">
            <JsonUploader />
          </TabsContent>
        </Tabs>

        <HelpSection />
        
      </div>
    </div>
  );
}