// CompetitorSelector.tsx (MODIFICADO Y MEJORADO)

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Loader2 } from 'lucide-react'; // Importamos un ícono de carga
import { fetchAllBusinesses } from '../lib/api'; // Importamos la función de API actualizada

export interface Competitor {
  id: string;
  name: string;
  category: string;
  area: string;
}

interface CompetitorSelectorProps {
  selectedCompetitors: Competitor[];
  onCompetitorsChange: (competitors: Competitor[]) => void;
}

export function CompetitorSelector({ selectedCompetitors, onCompetitorsChange }: CompetitorSelectorProps) {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');
  const [availableCompetitors, setAvailableCompetitors] = useState<Competitor[]>([]);

  // NUEVO: Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialBusinesses = async () => {
      setIsLoading(true);
      try {
        const response = await fetchAllBusinesses(1, 20);
        
        // --- LA CORRECCIÓN ESTÁ AQUÍ ---
        const formattedCompetitors = response.negocios.map(b => ({
          // ANTES:
          // id: b._id, 
          
          // AHORA (la línea correcta):
          id: b.business_id, // Usamos el business_id que coincide con las reseñas

          name: b.name,
          category: b.categories || 'N/A',
          area: b.city || 'N/A',
        }));
        
        setAvailableCompetitors(formattedCompetitors);
        setTotalPages(response.totalPaginas);
        setCurrentPage(response.paginaActual);
      } catch (error) {
        console.error("Error al cargar la lista inicial de negocios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialBusinesses();
  }, []);

  // NUEVO: Función para cargar más competidores
  const handleLoadMore = async () => {
    if (currentPage >= totalPages || isLoading) return; // No hacer nada si ya estamos en la última página o si ya está cargando

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchAllBusinesses(nextPage, 20);
      const newFormattedCompetitors = response.negocios.map(b => ({
        id: b._id,
        name: b.name,
        category: b.categories || 'N/A',
        area: b.city || 'N/A',
      }));
      // IMPORTANTE: Añadimos los nuevos resultados a la lista existente
      setAvailableCompetitors(prev => [...prev, ...newFormattedCompetitors]);
      setCurrentPage(response.paginaActual);
    } catch (error) {
      console.error("Error al cargar más negocios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCompetitor = () => {
    // ... (esta función no necesita cambios)
    if (selectedCompetitorId && selectedCompetitors.length < 5) {
      const competitor = availableCompetitors.find(c => c.id === selectedCompetitorId);
      if (competitor && !selectedCompetitors.find(sc => sc.id === competitor.id)) {
        onCompetitorsChange([...selectedCompetitors, competitor]);
        setSelectedCompetitorId('');
      }
    }
  };

  const handleRemoveCompetitor = (competitorId: string) => {
    // ... (esta función no necesita cambios)
    onCompetitorsChange(selectedCompetitors.filter(c => c.id !== competitorId));
  };

  const availableToSelect = availableCompetitors.filter(
    c => !selectedCompetitors.find(sc => sc.id === c.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Competidores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedCompetitorId} onValueChange={setSelectedCompetitorId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecciona un competidor..." />
            </SelectTrigger>
            <SelectContent>
              {availableToSelect.map(competitor => (
                <SelectItem key={competitor.id} value={competitor.id}>
                  {competitor.name} - {competitor.category}
                </SelectItem>
              ))}
              {/* NUEVO: Lógica para el botón "Cargar más" */}
              {currentPage < totalPages && (
                <div className="p-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Cargar más
                  </Button>
                </div>
              )}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleAddCompetitor}
            disabled={!selectedCompetitorId || selectedCompetitors.length >= 5}
          >
            Agregar
          </Button>
        </div>
        
        <div className="space-y-2">
          {/* ... (la sección de badges no necesita cambios) ... */}
          <p className="text-sm text-muted-foreground">
            Competidores seleccionados ({selectedCompetitors.length}/5):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCompetitors.map(competitor => (
              <Badge key={competitor.id} variant="secondary" className="flex items-center gap-1">
                {competitor.name}
                <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent" onClick={() => handleRemoveCompetitor(competitor.id)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}