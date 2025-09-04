import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Loader2 } from 'lucide-react'; 
import { fetchAllBusinesses } from '../lib/api'; 

/**
 * Interfaz que representa un competidor/negocio
 * @property {string} id - Identificador único del negocio
 * @property {string} name - Nombre del negocio
 * @property {string} category - Categoría o tipo de negocio
 * @property {string} area - Área o ciudad donde se encuentra el negocio
 */
export interface Competitor {
  id: string;
  name: string;
  category: string;
  area: string;
}

/**
 * Props para el componente CompetitorSelector
 * @property {Competitor[]} selectedCompetitors - Lista de competidores seleccionados
 * @property {function} onCompetitorsChange - Callback que se ejecuta al cambiar la selección
 */
interface CompetitorSelectorProps {
  selectedCompetitors: Competitor[];
  onCompetitorsChange: (competitors: Competitor[]) => void;
}

/**
 * Componente para seleccionar competidores de una lista paginada
 * Permite seleccionar hasta 5 competidores y muestra badges de los seleccionados
 * Implementa carga inicial y carga adicional bajo demanda
 */
export function CompetitorSelector({ selectedCompetitors, onCompetitorsChange }: CompetitorSelectorProps) {
  // Estado para el ID del competidor seleccionado en el dropdown
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');
  
  // Estado para la lista completa de competidores disponibles
  const [availableCompetitors, setAvailableCompetitors] = useState<Competitor[]>([]);
  
  // Estado de paginación: página actual
  const [currentPage, setCurrentPage] = useState(1);
  
  // Estado de paginación: total de páginas disponibles
  const [totalPages, setTotalPages] = useState(1);
  
  // Estado de carga para indicar cuando se están cargando más datos
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Efecto para cargar la lista inicial de negocios al montar el componente
   * Carga la primera página con 20 elementos
   */
  useEffect(() => {
    const loadInitialBusinesses = async () => {
      setIsLoading(true);
      try {
        // Llamada a la API para obtener negocios
        const response = await fetchAllBusinesses(1, 20);
        
        // Formateo de la respuesta a la estructura Competitor
        const formattedCompetitors = response.negocios.map(b => ({
          id: b.business_id, // Usa business_id en lugar de _id
          name: b.name,
          category: b.categories || 'N/A',
          area: b.city || 'N/A',
        }));
        
        // Actualización del estado con los competidores formateados
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

  /**
   * Función para cargar más negocios (paginación)
   * Se ejecuta al hacer clic en el botón "Cargar más"
   */
  const handleLoadMore = async () => {
    // Evita cargar más si ya está en la última página o si está cargando
    if (currentPage >= totalPages || isLoading) return; 

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      // Llamada a la API para la siguiente página
      const response = await fetchAllBusinesses(nextPage, 20);
      
      // Formateo de los nuevos competidores
      const newFormattedCompetitors = response.negocios.map(b => ({
        id: b._id, // Usa _id en lugar de business_id (posible inconsistencia)
        name: b.name,
        category: b.categories || 'N/A',
        area: b.city || 'N/A',
      }));
      
      // Agrega los nuevos competidores a la lista existente
      setAvailableCompetitors(prev => [...prev, ...newFormattedCompetitors]);
      setCurrentPage(response.paginaActual);
    } catch (error) {
      console.error("Error al cargar más negocios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Agrega un competidor a la lista de seleccionados
   * Verifica que no se exceda el límite de 5 y que no esté duplicado
   */
  const handleAddCompetitor = () => {
    if (selectedCompetitorId && selectedCompetitors.length < 5) {
      const competitor = availableCompetitors.find(c => c.id === selectedCompetitorId);
      if (competitor && !selectedCompetitors.find(sc => sc.id === competitor.id)) {
        onCompetitorsChange([...selectedCompetitors, competitor]);
        setSelectedCompetitorId(''); // Resetea la selección
      }
    }
  };

  /**
   * Elimina un competidor de la lista de seleccionados
   * @param {string} competitorId - ID del competidor a eliminar
   */
  const handleRemoveCompetitor = (competitorId: string) => {
    onCompetitorsChange(selectedCompetitors.filter(c => c.id !== competitorId));
  };

  /**
   * Filtra los competidores disponibles excluyendo los ya seleccionados
   */
  const availableToSelect = availableCompetitors.filter(
    c => !selectedCompetitors.find(sc => sc.id === c.id)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seleccionar Competidores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contenedor para el selector y botón de agregar */}
        <div className="flex gap-2">
          <Select value={selectedCompetitorId} onValueChange={setSelectedCompetitorId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecciona un competidor..." />
            </SelectTrigger>
            <SelectContent>
              {/* Renderiza cada competidor disponible como opción */}
              {availableToSelect.map(competitor => (
                <SelectItem key={competitor.id} value={competitor.id}>
                  {competitor.name} - {competitor.category}
                </SelectItem>
              ))}
              
              {/* Botón para cargar más resultados (paginación) */}
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
          
          {/* Botón para agregar el competidor seleccionado */}
          <Button 
            onClick={handleAddCompetitor}
            disabled={!selectedCompetitorId || selectedCompetitors.length >= 5}
          >
            Agregar
          </Button>
        </div>
        
        {/* Sección que muestra los competidores seleccionados */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Competidores seleccionados ({selectedCompetitors.length}/5):
          </p>
          <div className="flex flex-wrap gap-2">
            {/* Renderiza cada competidor seleccionado como un badge con opción para eliminar */}
            {selectedCompetitors.map(competitor => (
              <Badge key={competitor.id} variant="secondary" className="flex items-center gap-1">
                {competitor.name}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 hover:bg-transparent" 
                  onClick={() => handleRemoveCompetitor(competitor.id)}
                >
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
