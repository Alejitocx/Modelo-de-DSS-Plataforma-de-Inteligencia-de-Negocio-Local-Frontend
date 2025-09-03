import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadJsonFile } from '../lib/api';

// ▼▼▼ CAMBIO PRINCIPAL AQUÍ ▼▼▼
// Los 'value' ahora están en español para coincidir con el backend.
// Ahora el frontend y el backend están sincronizados.
const collections = [
  { value: 'negocios', label: 'Negocios (Businesses)', requiredKeys: ['business_id', 'name', 'state'] },
  { value: 'resenas',  label: 'Reseñas (Reviews)', requiredKeys: ['review_id', 'user_id', 'business_id', 'stars'] },
  { value: 'usuario',  label: 'Usuarios (Users)', requiredKeys: ['user_id', 'name'] },
  { value: 'tips',     label: 'Tips', requiredKeys: ['user_id', 'business_id', 'text', 'date'] },
  { value: 'checkin',  label: 'Check-ins', requiredKeys: ['business_id', 'date'] },
];

export function JsonUploader() {
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setStatus({ type: 'idle', message: '' });
    }
  };

  const validateJson = (data: any, collectionValue: string): boolean => {
    const collection = collections.find(c => c.value === collectionValue);
    if (!collection) {
      setStatus({ type: 'error', message: 'Colección no válida.' });
      return false;
    }
    if (!Array.isArray(data) || data.length === 0) {
      setStatus({ type: 'error', message: 'El JSON debe ser un array de objetos y no puede estar vacío.' });
      return false;
    }
    const firstItem = data[0];
    for (const key of collection.requiredKeys) {
      if (!(key in firstItem)) {
        setStatus({ type: 'error', message: `Validación fallida: El primer objeto en el JSON no tiene la clave requerida '${key}'.` });
        return false;
      }
    }
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedCollection) return;

    setIsUploading(true);
    setStatus({ type: 'idle', message: '' });

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);

        if (!validateJson(data, selectedCollection)) {
          setIsUploading(false);
          return;
        }
        
        // 'selectedCollection' ahora contiene el valor correcto en español (ej: 'negocios', 'tips', etc.)
        const result = await uploadJsonFile(selectedFile, selectedCollection as any);
        setStatus({ type: 'success', message: `¡Éxito! Registros afectados: ${JSON.stringify(result)}` });
      } catch (error: any) {
        setStatus({ type: 'error', message: error.message || 'Error desconocido al procesar el archivo.' });
      } finally {
        setIsUploading(false);
      }
    };
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select onValueChange={setSelectedCollection} value={selectedCollection}>
            <SelectTrigger><SelectValue placeholder="1. Selecciona una colección..." /></SelectTrigger>
            <SelectContent>
              {collections.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="file" accept=".json" onChange={handleFileChange} disabled={!selectedCollection} />
        </div>
        <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="w-full">
          {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isUploading ? 'Subiendo y Procesando...' : '3. Iniciar Carga'}
        </Button>
        {status.type !== 'idle' && (
          <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
            {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{status.type === 'success' ? 'Completado' : 'Error'}</AlertTitle>
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}