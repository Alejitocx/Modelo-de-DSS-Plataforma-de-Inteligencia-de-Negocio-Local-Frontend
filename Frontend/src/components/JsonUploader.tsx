import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadJsonFile } from '../lib/api';

/**
 * Definición de las colecciones disponibles para carga de datos
 * @property {string} value - Identificador interno de la colección
 * @property {string} label - Nombre legible para mostrar en la UI
 * @property {string[]} requiredKeys - Campos obligatorios que deben estar en el JSON
 */
const collections = [
  { value: 'negocios', label: 'Negocios (Businesses)', requiredKeys: ['business_id', 'name', 'state'] },
  { value: 'resenas',  label: 'Reseñas (Reviews)', requiredKeys: ['review_id', 'user_id', 'business_id', 'stars'] },
  { value: 'usuario',  label: 'Usuarios (Users)', requiredKeys: ['user_id', 'name'] },
  { value: 'tips',     label: 'Tips', requiredKeys: ['user_id', 'business_id', 'text', 'date'] },
  { value: 'checkin',  label: 'Check-ins', requiredKeys: ['business_id', 'date'] },
];

/**
 * Genera un mensaje de éxito personalizado basado en el resultado de la carga
 * @param {Object} result - Resultado de la operación de carga
 * @param {number} result.upserted - Número de registros insertados o actualizados
 * @param {number} result.modified - Número de registros modificados
 * @returns {string} Mensaje descriptivo del resultado
 */
const generateSuccessMessage = (result: { upserted: number; modified: number }): string => {
  const { upserted, modified } = result;
  if (upserted > 0 && modified > 0) return `¡Carga completada! Se añadieron ${upserted} nuevos registros y se actualizaron ${modified} existentes.`;
  if (upserted > 0) return `¡Carga completada! Se añadieron ${upserted} nuevos registros.`;
  if (modified > 0) return `¡Carga completada! Se actualizaron ${modified} registros existentes.`;
  return 'Proceso finalizado. El archivo no contenía registros nuevos o diferentes para actualizar.';
};

/**
 * Genera un mensaje de error personalizado basado en el tipo de error
 * @param {any} error - Objeto de error capturado
 * @param {string} selectedCollection - Colección seleccionada para la carga
 * @returns {string} Mensaje de error descriptivo y útil para el usuario
 */
const generateErrorMessage = (error: any, selectedCollection: string): string => {
  const errorMessage = String(error.message || 'Error desconocido').toLowerCase();
  const collectionInfo = collections.find(c => c.value === selectedCollection);
  const collectionLabel = collectionInfo ? collectionInfo.label.split('(')[0].trim() : 'la colección seleccionada';

  if (errorMessage.includes('validación fallida')) {
    const missingKey = errorMessage.split("'")[1] || 'una columna requerida';
    return `Error de Contenido: El archivo no tiene el formato correcto para "${collectionLabel}". Asegúrate de que el archivo contiene la columna "${missingKey}".`;
  }

  if (errorMessage.includes('json')) {
    return 'Error de Formato: El archivo seleccionado no parece ser un JSON válido. Por favor, verifica su estructura e inténtalo de nuevo.`;
  }
  if (errorMessage.includes('network') || errorMessage.includes('failed to fetch')) {
    return 'Error de Conexión: No se pudo comunicar con el servidor. Por favor, revisa tu conexión a internet.';
  }
  
  return 'Ocurrió un error inesperado. Por favor, revisa el archivo y vuelve a intentarlo.';
};

/**
 * Componente para carga masiva de datos mediante archivos JSON
 * Permite seleccionar una colección, cargar un archivo JSON y validar su estructura
 * antes de enviarlo al servidor
 */
export function JsonUploader() {
  // Estado para la colección seleccionada
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  
  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Estado para indicar si está en proceso de carga
  const [isUploading, setIsUploading] = useState(false);
  
  // Estado para el resultado de la operación (éxito/error)
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ 
    type: 'idle', 
    message: '' 
  });

  /**
   * Maneja el cambio de selección de archivo
   * @param {React.ChangeEvent<HTMLInputElement>} event - Evento de cambio del input file
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setStatus({ type: 'idle', message: '' }); // Resetea el estado de mensajes
    }
  };

  /**
   * Valida la estructura del JSON contra los requisitos de la colección seleccionada
   * @param {any} data - Datos del JSON parseado
   * @param {string} collectionValue - Identificador de la colección seleccionada
   * @returns {boolean} True si la validación es exitosa, False en caso contrario
   */
  const validateJson = (data: any, collectionValue: string): boolean => {
    const collection = collections.find(c => c.value === collectionValue);
    if (!collection) {
      setStatus({ type: 'error', message: 'Colección no válida.' });
      return false;
    }
    
    // Verifica que sea un array no vacío
    if (!Array.isArray(data) || data.length === 0) {
      setStatus({ type: 'error', message: 'El JSON debe ser un array de objetos y no puede estar vacío.' });
      return false;
    }
    
    // Verifica que el primer objeto tenga todas las claves requeridas
    const firstItem = data[0];
    for (const key of collection.requiredKeys) {
      if (!(key in firstItem)) {
        setStatus({ type: 'error', message: `Validación fallida: El primer objeto en el JSON no tiene la clave requerida '${key}'.` });
        return false;
      }
    }
    
    return true;
  };

  /**
   * Maneja el proceso de carga y validación del archivo JSON
   */
  const handleUpload = async () => {
    // Validación básica
    if (!selectedFile || !selectedCollection) return;

    setIsUploading(true);
    setStatus({ type: 'idle', message: '' });

    const reader = new FileReader();
    
    // Callback que se ejecuta cuando se completa la lectura del archivo
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        // Validar estructura del JSON
        if (!validateJson(data, selectedCollection)) {
          setStatus(prevStatus => ({ 
            ...prevStatus, 
            message: generateErrorMessage(new Error(prevStatus.message), selectedCollection) 
          }));
          setIsUploading(false);
          return;
        }
        
        // Enviar al servidor si la validación es exitosa
        const result = await uploadJsonFile(selectedFile, selectedCollection as any);
        setStatus({ type: 'success', message: generateSuccessMessage(result) });

      } catch (error: any) {
        // Manejar errores de parseo u otros errores
        setStatus({ type: 'error', message: generateErrorMessage(error, selectedCollection) });
      } finally {
        setIsUploading(false);
      }
    };
    
    // Iniciar lectura del archivo
    reader.readAsText(selectedFile);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga Masiva de Datos</CardTitle>
        <CardDescription>
          Selecciona una colección y sube un archivo JSON para poblar la base de datos.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Selector de colección y selector de archivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={setSelectedCollection} value={selectedCollection}>
            <SelectTrigger>
              <SelectValue placeholder="1. Selecciona una colección..." />
            </SelectTrigger>
            <SelectContent>
              {collections.map(c => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange} 
            disabled={!selectedCollection} 
          />
        </div>
        
        {/* Botón de carga */}
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading} 
          className="w-full"
        >
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? 'Subiendo y Procesando...' : '3. Iniciar Carga'}
        </Button>
        
        {/* Área de notificaciones */}
        {status.type !== 'idle' && (
          <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
            {status.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>
              {status.type === 'success' ? 'Proceso Completado' : 'Ocurrió un Error'}
            </AlertTitle>
            <AlertDescription>
              {status.message}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
