import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge'; 
import { CheckCircle2, XCircle, Minus } from 'lucide-react'; 

interface BusinessData {
  business_id: string;
  name: string;
  attributes: Record<string, any>;
}

interface AttributeAnalysisProps {
  businessData?: BusinessData[] | null;
}

const formatAttributeValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined || value === 'None') {
    return <Minus className="text-gray-400 mx-auto" size={18} />;
  }

  const lowerValue = String(value).toLowerCase();

  if (lowerValue === 'true') return <CheckCircle2 className="text-green-500 mx-auto" />;
  if (lowerValue === 'false') return <XCircle className="text-red-500 mx-auto" />;

  if (typeof value === 'string') {
    const cleanedValue = value.replace(/u'|'|u"/g, '');
    return <Badge variant="secondary">{cleanedValue}</Badge>;
  }

  if (typeof value === 'object') {
    return <span className="text-xs text-gray-600">Objeto complejo</span>;
  }

  return <Badge variant="secondary">{String(value)}</Badge>;
};

export function AttributeAnalysis({ businessData }: AttributeAnalysisProps) {
  if (!businessData || businessData.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <p>No hay datos de atributos para mostrar.</p>
        </CardContent>
      </Card>
    );
  }

  const allAttributeKeys = new Set<string>();
  businessData.forEach(business => {
    if (business.attributes) {
      Object.keys(business.attributes).forEach(key => allAttributeKeys.add(key));
    }
  });
  const uniqueAttributes = Array.from(allAttributeKeys).sort();

  return (
    <Card>
      <CardHeader> 
        <CardTitle>📊 Tabla Comparativa de Atributos</CardTitle>
      </CardHeader>
      <CardContent>
        {/* El div contenedor permite el scroll horizontal */}
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {/* --- ENCABEZADO FIJO (STICKY) --- */}
                <TableHead className="font-bold text-base sticky left-0 bg-white shadow-sm min-w-[250px]">
                  Atributo
                </TableHead>
                {/* Encabezados de negocios con estilo */}
                {businessData.map((business, index) => (
                  <TableHead 
                    key={business.business_id} 
                    // Aplicamos fondo alternado y borde izquierdo
                    className={`text-center font-semibold border-l ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                  >
                    {business.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueAttributes.map(attributeKey => (
                <TableRow key={attributeKey}>
                  {/* --- CELDA DE ATRIBUTO FIJA (STICKY) --- */}
                  <TableCell className="font-medium sticky left-0 bg-white shadow-sm">
                    {attributeKey}
                  </TableCell>
                  {/* Celdas de datos con estilo */}
                  {businessData.map((business, index) => (
                    <TableCell 
                      key={business.business_id} 
                      // Aplicamos fondo alternado y borde izquierdo
                      className={`text-center border-l ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}
                    >
                      {formatAttributeValue(business.attributes?.[attributeKey])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}