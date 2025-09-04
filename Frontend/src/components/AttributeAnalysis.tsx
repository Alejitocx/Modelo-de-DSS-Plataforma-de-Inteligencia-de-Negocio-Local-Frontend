import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge'; 
import { CheckCircle2, XCircle, Minus, Info } from 'lucide-react'; 
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface BusinessData {
  business_id: string;
  name: string;
  attributes: Record<string, any>;
}

interface AttributeAnalysisProps {
  businessData?: BusinessData[] | null;
}

const attributeTranslations: {
  keys: Record<string, string>;
  values: Record<string, Record<string, string>>;
} = {
  keys: {
    BusinessAcceptsCreditCards: 'Acepta Tarjetas de Crédito',
    ByAppointmentOnly: 'Solo con Cita Previa',
    GoodForKids: 'Apto para Niños',
    RestaurantsTakeOut: 'Comida para Llevar',
    RestaurantsDelivery: 'Servicio a Domicilio',
    OutdoorSeating: 'Asientos al Aire Libre',
    RestaurantsReservations: 'Admite Reservas',
    BikeParking: 'Estacionamiento de Bicicletas',
    HasTV: 'Tiene Televisión',
    Caters: 'Ofrece Catering',
    CoatCheck: 'Guardarropa',
    DogsAllowed: 'Admite Perros',
    DriveThru: 'Servicio en Auto',
    HappyHour: 'Happy Hour',
    RestaurantsGoodForGroups: 'Apto para Grupos',
    RestaurantsTableService: 'Servicio de Mesa',
    WheelchairAccessible: 'Acceso para Silla de Ruedas',

    RestaurantsPriceRange2: 'Rango de Precios',
    WiFi: 'Wi-Fi',
    NoiseLevel: 'Nivel de Ruido',
    Alcohol: 'Venta de Alcohol',
    RestaurantsAttire: 'Código de Vestimenta',

    Ambience: 'Ambiente',
    BusinessParking: 'Estacionamiento',
    GoodForMeal: 'Ideal Para',

    touristy: 'Turístico',
    hipster: 'Moderno',
    romantic: 'Romántico',
    divey: 'Bohemio',
    intimate: 'Íntimo',
    trendy: 'De Moda',
    upscale: 'Elegante',
    classy: 'Clásico',
    casual: 'Casual',
  },
  values: {
    WiFi: { 'free': 'Gratis', 'paid': 'De pago', 'no': 'No disponible' },
    NoiseLevel: { 'quiet': 'Silencioso', 'average': 'Promedio', 'loud': 'Ruidoso', 'very_loud': 'Muy Ruidoso' },
    RestaurantsPriceRange2: { '1': 'Económico ($)', '2': 'Moderado ($$)', '3': 'Caro ($$$)', '4': 'Lujoso ($$$$)' },
    Alcohol: { 'none': 'No disponible', 'beer_and_wine': 'Cerveza y Vino', 'full_bar': 'Bar Completo' },
    RestaurantsAttire: { 'casual': 'Casual', 'dressy': 'Elegante', 'formal': 'Formal' },
  }
};


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
 * Traduce el nombre técnico de un atributo a un formato legible.
 */
const formatAttributeName = (key: string): string => {
  return attributeTranslations.keys[key] || key.replace(/([A-Z])/g, ' $1').trim();
};

/**
 * Parsea una cadena que representa un objeto (ej. de Ambience) y muestra insignias para los valores 'true'.
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
    return <Badge variant="secondary">{value}</Badge>; // Fallback si el parseo falla
  }
};

/**
 * Función principal que formatea el valor de una celda de la tabla según su tipo.
 */
const formatAttributeValue = (value: any, attributeKey: string): React.ReactNode => {
  // 1. Manejar valores nulos o indefinidos
  if (value === null || value === undefined || value === 'None') {
    return <Minus className="text-gray-400 mx-auto" size={18} title="No especificado" />;
  }

  // 2. Manejar cadenas que parecen objetos (como Ambience)
  if (typeof value === 'string' && value.trim().startsWith('{') && value.trim().endsWith('}')) {
    return parseStringObject(value);
  }

  // 3. Manejar objetos reales de JavaScript (como Horarios)
  if (typeof value === 'object' && !Array.isArray(value)) {
    return <ComplexObjectPopover data={value} />;
  }

  // 4. Manejar booleanos
  const lowerValue = String(value).toLowerCase();
  if (lowerValue === 'true') return <CheckCircle2 className="text-green-500 mx-auto" title="Sí" />;
  if (lowerValue === 'false') return <XCircle className="text-red-500 mx-auto" title="No" />;

  // 5. Manejar valores con traducciones específicas (como WiFi, NoiseLevel)
  const cleanedValue = String(value).replace(/u'|'|u"|"/g, '');
  const specificTranslations = attributeTranslations.values[attributeKey];
  if (specificTranslations && specificTranslations[cleanedValue]) {
    return <Badge variant="default">{specificTranslations[cleanedValue]}</Badge>;
  }

  // 6. Fallback para cualquier otro valor de tipo string/number
  return <Badge variant="secondary">{cleanedValue}</Badge>;
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