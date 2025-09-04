import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge'; 
import { CheckCircle2, XCircle, Minus, Info } from 'lucide-react'; 
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

/**
 * Interfaz que representa los datos de un negocio
 * @property {string} business_id - Identificador único del negocio
 * @property {string} name - Nombre del negocio
 * @property {Record<string, any>} attributes - Objeto con atributos y características del negocio
 */
interface BusinessData {
  business_id: string;
  name: string;
  attributes: Record<string, any>;
}

/**
 * Props para el componente AttributeAnalysis
 * @property {BusinessData[] | null} [businessData] - Array opcional de datos de negocios a mostrar
 */
interface AttributeAnalysisProps {
  businessData?: BusinessData[] | null;
}

/**
 * Diccionario de traducciones para atributos y valores
 * @property {Record<string, string>} keys - Mapeo de nombres técnicos a nombres legibles
 * @property {Record<string, Record<string, string>>} values - Mapeo de valores técnicos a valores legibles
 */
const attributeTranslations: {
  keys: Record<string, string>;
  values: Record<string, Record<string, string>>;
} = {
  keys: {
    BusinessAcceptsCreditCards: 'Acepta Tarjetas de Crédito',
    ByAppointmentOnly: 'Solo con Cita Previa',
    // ... más traducciones de keys
  },
  values: {
    WiFi: { 'free': 'Gratis', 'paid': 'De pago', 'no': 'No disponible' },
    // ... más traducciones de valores
  }
};

/**
 * Componente que muestra detalles complejos de atributos en un popover
 * @param {Object} props - Props del componente
 * @param {any} props.data - Datos complejos a mostrar en el popover
 */
const ComplexObjectPopover = ({ data }: { data: any }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="flex items-center gap-1.5 mx-auto cursor-pointer text-blue-600 hover:underline">
        <Info size={16} />
        <span>Ver detalles</span>
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-80 bg-gray-800 text-white border-gray-700">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Detalles del Atributo</h4>
        <p className="text-sm text-gray-300">Este atributo contiene múltiples valores anidados.</p>
      </div>
      <pre className="mt-2 w-full overflow-x-auto rounded-md bg-gray-900 p-4">
        <code className="text-sm text-yellow-300">{JSON.stringify(data, null, 2)}</code>
      </pre>
    </PopoverContent>
  </Popover>
);

/**
 * Convierte nombres técnicos de atributos a formato legible
 * @param {string} key - Nombre técnico del atributo
 * @returns {string} Nombre traducido o formateado
 */
const formatAttributeName = (key: string): string => {
  return attributeTranslations.keys[key] || key.replace(/([A-Z])/g, ' $1').trim();
};

/**
 * Parsea cadenas que representan objetos y muestra valores true como badges
 * @param {string} value - Cadena a parsear
 * @returns {React.ReactNode} Badges con los valores o fallback
 */
const parseStringObject = (value: string): React.ReactNode => {
  try {
    const jsonString = value.replace(/'/g, '"').replace(/False/g, 'false').replace(/True/g, 'true');
    const obj = JSON.parse(jsonString);
    const trueAttributes = Object.keys(obj).filter(key => obj[key] === true);

    if (trueAttributes.length === 0) {
      return <Badge variant="outline">No especificado</Badge>;
    }

    return (
      <div className="flex flex-wrap gap-1 justify-center">
        {trueAttributes.map(key => (
          <Badge key={key} variant="default" className="bg-teal-500 hover:bg-teal-600">
            {formatAttributeName(key)}
          </Badge>
        ))}
      </div>
    );
  } catch (e) {
    return <Badge variant="secondary">{value}</Badge>;
  }
};

/**
 * Formatea valores de atributos según su tipo y contenido
 * @param {any} value - Valor a formatear
 * @param {string} attributeKey - Key del atributo para buscar traducciones
 * @returns {React.ReactNode} Elemento JSX apropiado para el valor
 */
const formatAttributeValue = (value: any, attributeKey: string): React.ReactNode => {
  // Manejo de valores nulos/undefined
  if (value === null || value === undefined || value === 'None') {
    return <Minus className="text-gray-400 mx-auto" size={18} title="No especificado" />;
  }

  // Manejo de strings que representan objetos
  if (typeof value === 'string' && value.trim().startsWith('{') && value.trim().endsWith('}')) {
    return parseStringObject(value);
  }

  // Manejo de objetos JavaScript
  if (typeof value === 'object' && !Array.isArray(value)) {
    return <ComplexObjectPopover data={value} />;
  }

  // Manejo de booleanos
  const lowerValue = String(value).toLowerCase();
  if (lowerValue === 'true') return <CheckCircle2 className="text-green-500 mx-auto" title="Sí" />;
  if (lowerValue === 'false') return <XCircle className="text-red-500 mx-auto" title="No" />;

  // Manejo de valores con traducciones específicas
  const cleanedValue = String(value).replace(/u'|'|u"|"/g, '');
  const specificTranslations = attributeTranslations.values[attributeKey];
  if (specificTranslations && specificTranslations[cleanedValue]) {
    return <Badge variant="default">{specificTranslations[cleanedValue]}</Badge>;
  }

  // Fallback para otros valores
  return <Badge variant="secondary">{cleanedValue}</Badge>;
};

/**
 * Componente principal que muestra tabla comparativa de atributos de negocios
 * @param {AttributeAnalysisProps} props - Props del componente
 */
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

  // Recoge todas las keys únicas de atributos de todos los negocios
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
        <CardDescription>
          Compara las características y servicios de cada negocio. Haz clic en "Ver detalles" para explorar datos complejos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-base sticky left-0 bg-white shadow-sm min-w-[250px]">
                  Característica
                </TableHead>
                {businessData.map((business, index) => (
                  <TableHead key={business.business_id} className={`text-center font-semibold border-l ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                    {business.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {uniqueAttributes.map(attributeKey => (
                <TableRow key={attributeKey}>
                  <TableCell className="font-medium sticky left-0 bg-white shadow-sm">
                    {formatAttributeName(attributeKey)}
                  </TableCell>
                  {businessData.map((business, index) => (
                    <TableCell key={business.business_id} className={`text-center border-l ${index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}`}>
                      {formatAttributeValue(business.attributes?.[attributeKey], attributeKey)}
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
