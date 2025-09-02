import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

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

const availableCompetitors: Competitor[] = [
  { id: '1', name: 'Restaurante El Buen Sabor', category: 'Restaurante', area: 'Centro' },
  { id: '2', name: 'La Parrilla Dorada', category: 'Restaurante', area: 'Centro' },
  { id: '3', name: 'Café Aromático', category: 'Cafetería', area: 'Centro' },
  { id: '4', name: 'Pizza Suprema', category: 'Restaurante', area: 'Norte' },
  { id: '5', name: 'Sushi Zen', category: 'Restaurante', area: 'Centro' },
  { id: '6', name: 'Burger Palace', category: 'Restaurante', area: 'Sur' },
  { id: '7', name: 'Taco Loco', category: 'Restaurante', area: 'Centro' },
  { id: '8', name: 'Café Central', category: 'Cafetería', area: 'Centro' },
];

export function CompetitorSelector({ selectedCompetitors, onCompetitorsChange }: CompetitorSelectorProps) {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>('');

  const handleAddCompetitor = () => {
    if (selectedCompetitorId && selectedCompetitors.length < 5) {
      const competitor = availableCompetitors.find(c => c.id === selectedCompetitorId);
      if (competitor && !selectedCompetitors.find(sc => sc.id === competitor.id)) {
        onCompetitorsChange([...selectedCompetitors, competitor]);
        setSelectedCompetitorId('');
      }
    }
  };

  const handleRemoveCompetitor = (competitorId: string) => {
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
          <p className="text-sm text-muted-foreground">
            Competidores seleccionados ({selectedCompetitors.length}/5):
          </p>
          <div className="flex flex-wrap gap-2">
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