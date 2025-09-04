// En: src/lib/utils.ts

/**
 * Calcula la media móvil simple para una serie de datos.
 * @param data Array de números o nulos.
 * @param windowSize El número de períodos a promediar (ej. 3 para una media móvil de 3 meses).
 * @returns Un nuevo array con los valores de la media móvil.
 */
export function calculateMovingAverage(data: (number | null)[], windowSize: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    // Obtenemos la "ventana" de datos anteriores, incluyendo el actual
    const window = data.slice(Math.max(0, i - windowSize + 1), i + 1);
    
    // Filtramos para quitar los valores nulos y tener solo números reales
    const validData = window.filter(val => val !== null) as number[];
    
    if (validData.length === 0) {
      // Si no hay datos válidos en la ventana, el resultado es nulo
      result.push(null);
    } else {
      // Calculamos la suma y luego el promedio
      const sum = validData.reduce((acc, val) => acc + val, 0);
      result.push(sum / validData.length);
    }
  }
  return result;
}