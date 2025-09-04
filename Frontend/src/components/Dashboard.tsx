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
import { calculateMovingAverage } from '../lib/calculateMovingAverage'; 
import { HelpSection } from './DashboardHelpButton';

// Paleta de colores para visualización de datos
const COLOR_PALETTE = ['#1e90ff', '#ff4500', '#32cd32', '#9370db', '#00ced1', '#ffa500'];

/**
 * Componente principal del Dashboard de Análisis Competitivo
 * Coordina la visualización de métricas, atributos y funciones administrativas
 */
export function Dashboard() {
  // ID y nombre del negocio principal (hardcodeado actualmente)
  const businessId = "F5N-gTCaKg2gJHEbJcqmKA"; 
  const businessName = "Joe's Pizza";

  // Estado para datos resumidos del negocio principal
  const [summaryData, setSummaryData] = useState({ rating: 0, reviewCount: 0 });
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  // Estado para gestión de competidores
  const [selectedCompetitors, setSelectedCompetitors] = useState<Competitor[]>([]);
  
  // Estado para datos de métricas y atributos
  const [metricsData, setMetricsData] = useState<CompareData | null>(null);
  const [attributeData, setAttributeData] = useState<any[] | null>(null);
  
  // Estados de carga y control de UI
  const [isLoadingCompare, setIsLoadingCompare] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Estado para datos de métricas procesadas (con media móvil aplicada)
  const [processedMetricsData, setProcessedMetricsData] = useState<CompareData | null>(null);

  /**
   * Efecto para cargar datos resumidos del negocio principal al montar el componente
   * Obtiene calificación promedio y conteo de reseñas
   */
  useEffect(() => {
    const loadSummaryData = async () => {
      setIsLoadingSummary(true);
      try {
        // Consultas paralelas para rating y conteo de reseñas
        const [ratingResponse, countResponse] = await Promise.all([
          fetchKpi({ 
            collection: 'resenas', 
            op: 'avg', 
            valueField: 'stars', 
            match: { business_id: businessId } 
          }),
          fetchKpi({ 
            collection: 'resenas', 
            op: 'count', 
            match: { business_id: businessId } 
          })
        ]);
        
        // Actualización del estado con datos formateados
        setSummaryData({
          rating: parseFloat(ratingResponse.value.toFixed(1)),
          reviewCount: countResponse.value,
        });
      } catch (error) { 
        console.error("Error al cargar datos de resumen:", error); 
      } finally { 
        setIsLoadingSummary(false); 
      }
    };
    loadSummaryData();
  }, [businessId]);

  /**
   * Efecto para procesar datos de métricas aplicando media móvil
   * Se ejecuta cuando metricsData cambia
   */
  useEffect(() => {
    if (!metricsData) return;
    
    // Ventana de 120 meses (10 años) para el cálculo de media móvil
    const TEN_YEAR_WINDOW = 120;
    
    // Crear copia profunda de los datos para procesamiento
    const newProcessedData = JSON.parse(JSON.stringify(metricsData));

    // Aplicar media móvil a los datos de ratingOverTime
    if (newProcessedData.ratingOverTime && newProcessedData.ratingOverTime.datasets) {
      newProcessedData.ratingOverTime.datasets.forEach((dataset: any) => {
        dataset.data = calculateMovingAverage(dataset.data, TEN_YEAR_WINDOW);
      });
    }
    
    // Actualizar estado con datos procesados
    setProcessedMetricsData(newProcessedData);
  }, [metricsData]);

  /**
   * Maneja la comparación entre el negocio principal y los competidores seleccionados
   * Obtiene métricas comparativas y atributos de todos los negocios
   */
  const handleCompare = async () => {
    // Validación: requiere al menos un competidor seleccionado
    if (selectedCompetitors.length === 0) return;
    
    setIsLoadingCompare(true);
    setHasSearched(true);
    
    try {
      // Preparar lista de IDs para consulta (excluyendo el negocio principal si está presente)
      const competitorIds = selectedCompetitors.map(c => c.id).filter(id => id !== businessId);
      const allBusinessIds = [businessId, ...competitorIds];
      
      // Consultas paralelas para métricas y atributos
      const [compareResult, attributesResult] = await Promise.all([
        fetchCompareMetrics(allBusinessIds),
        fetchBusinessAttributes(allBusinessIds)
      ]);

      /**
       * Asigna colores de la paleta a los datasets de gráficos
       * @param chartData - Datos del gráfico a colorear
       * @returns Datos del gráfico con colores asignados
       */
      const assignColors = (chartData: any) => {
        if (!chartData || !chartData.datasets) return chartData;
        return { 
          ...chartData, 
          datasets: chartData.datasets.map((d: any, i: number) => ({ 
            ...d, 
            color: COLOR_PALETTE[i % COLOR_PALETTE.length] 
          })) 
        };
      };

      // Actualizar estados con datos obtenidos y coloreados
      setMetricsData({
        ratingOverTime: assignColors(compareResult.ratingOverTime),
        reviewsOverTime: assignColors(compareResult.reviewsOverTime),
        ratingDistribution: assignColors(compareResult.ratingDistribution),
      });
      
      setAttributeData(attributesResult);
    } catch (error) { 
      console.error("Error al cargar datos del dashboard:", error); 
    } finally { 
      setIsLoadingCompare(false); 
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Header con título y icono */}
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
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">⭐ Calificación Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? '...' : summaryData.rating}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">👥 Total de Reseñas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? '...' : summaryData.reviewCount}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">🏢 Competidores Seleccionados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedCompetitors.length} / 5
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con pestañas */}
      <main>
        <Tabs defaultValue="compare" className="space-y-6">
          <TabsList className="flex w-full">
            <TabsTrigger value="compare" className="flex-1">📊 Métricas Comparativas</TabsTrigger>
            <TabsTrigger value="attributes" className="flex-1">🎯 Análisis de Atributos</TabsTrigger>
            <TabsTrigger value="admin" className="flex-1">⚙️ Administración</TabsTrigger>
          </TabsList>
          
          {/* Pestaña de Métricas Comparativas */}
          <TabsContent value="compare" className="min-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-end p-4 border rounded-lg bg-white shadow-sm">
              <CompetitorSelector 
                selectedCompetitors={selectedCompetitors} 
                onCompetitorsChange={setSelectedCompetitors} 
              />
              <Button 
                onClick={handleCompare} 
                disabled={selectedCompetitors.length === 0 || isLoadingCompare}
              >
                {isLoadingCompare ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoadingCompare ? 'Analizando...' : 'Comparar'}
              </Button>
            </div>
            
            <div className="mt-6">
              {hasSearched ? (
                isLoadingCompare ? 
                  <p className="text-center py-10">Cargando métricas...</p> : 
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
          
          {/* Pestaña de Análisis de Atributos */}
          <TabsContent value="attributes" className="min-h-[60vh]">
            {hasSearched ? ( 
              isLoadingCompare ? 
                <p className="text-center py-10">Cargando análisis...</p> : 
                <AttributeAnalysis businessData={attributeData} /> 
            ) : ( 
              <div className="text-center text-gray-500 mt-10 p-8 border-2 border-dashed rounded-lg"> 
                <p>Primero realiza una comparación para ver el análisis de atributos.</p> 
              </div> 
            )}
          </TabsContent>
          
          {/* Pestaña de Administración */}
          <TabsContent value="admin" className="min-h-[60vh]">
            <JsonUploader />
          </TabsContent>
        </Tabs>
      </main>

      {/* Sección de ayuda */}
      <div className="mt-24">
        <HelpSection />
      </div>
    </div>
  );
}
