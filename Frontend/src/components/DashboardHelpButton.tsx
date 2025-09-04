import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { HelpCircle, CheckCircle2, XCircle, Minus, Info } from 'lucide-react';

/**
 * Componente de sección de ayuda que proporciona guías de uso para el dashboard
 * Muestra información organizada en acordeones para cada sección principal de la aplicación
 */
export function HelpSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          Guía de Uso y Ayuda del Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Acordeón que contiene las secciones de ayuda */}
        <Accordion type="single" collapsible className="w-full">
          
          {/* Sección de ayuda para la pestaña de Métricas Comparativas */}
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold">📊 Pestaña de Métricas Comparativas</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 pl-4">
                <li><strong>Selector de Competidores:</strong> Empieza escribiendo el nombre de un competidor para añadirlo a la comparación (hasta 5).</li>
                <li><strong>Botón "Comparar":</strong> Una vez seleccionados, haz clic aquí para generar los gráficos.</li>
                <li><strong>Gráfico de Puntuación:</strong> La línea punteada son los datos reales, la <strong>línea sólida es la tendencia (media móvil)</strong> para un análisis más claro.</li>
                <li><strong>Control de Media Móvil:</strong> Usa el deslizador para ajustar el período de la tendencia (corto o largo plazo).</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de ayuda para la pestaña de Análisis de Atributos */}
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold">🎯 Pestaña de Análisis de Atributos</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 pl-4">
                <li>La tabla compara características como "Apto para Niños", "Wi-Fi", etc.</li>
                <li>
                  Los íconos 
                  <CheckCircle2 className="inline h-4 w-4 text-green-500" title="Disponible"/>, 
                  <XCircle className="inline h-4 w-4 text-red-500" title="No disponible"/> y 
                  <Minus className="inline h-4 w-4 text-gray-400" title="No especificado"/> 
                  te dan una vista rápida.
                </li>
                <li>Para atributos como "Ambiente", verás insignias con las características principales.</li>
                <li>
                  Si ves <Info className="inline h-4 w-4 text-blue-500" title="Más información"/> 
                  <strong>"Ver detalles"</strong>, haz clic para ver información compleja.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          {/* Sección de ayuda para la pestaña de Administración */}
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold">⚙️ Pestaña de Administración</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 pl-4">
                <li><strong>1. Selecciona una colección:</strong> Elige el tipo de datos que vas a subir.</li>
                <li><strong>2. Elige un archivo JSON:</strong> Selecciona el archivo de tu computadora.</li>
                <li><strong>3. Inicia la Carga:</strong> Haz clic para subir y procesar los datos.</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
}
