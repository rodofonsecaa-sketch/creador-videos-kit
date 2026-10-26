export type Transition = 'fade' | 'slide' | 'wipe';

export type Word = {text: string; startMs: number; endMs: number};
export type Bar = {etiqueta: string; valor: number};
export type Kpi = {etiqueta: string; valor: number; prefijo?: string; sufijo?: string};

export type Cifra = {valor: number; etiqueta?: string; prefijo?: string; sufijo?: string; porcentaje?: number};
export type Paso = {titulo: string; detalle?: string; icono: string};

export type Scene = {
  plantilla?: 'portada' | 'dividida' | 'cifra' | 'pasos' | 'cierre'; // sin plantilla: título + gráfico/kpis
  puntos?: string[]; // dividida: lista con check
  cifra?: Cifra; // cifra: número grande (con anillo si hay porcentaje)
  pasos?: Paso[]; // pasos: iconos (camion, caja, bodega, grafico, reloj, check, ...)
  cta?: string; // cierre: botón de llamada a la acción
  titulo: string;
  subtitulo?: string;
  subtitulo_pie?: string; // subtítulo fijo (si no hay narración)
  narracion?: string; // texto de la voz en off; build.mjs genera voz + subtítulos sincronizados
  imagen?: string; // archivo dentro de public/img
  video?: string; // fondo en movimiento: archivo dentro de public/video (scripts/stock-video.mjs)
  grafico?: {datos: Bar[]; unidad?: string}; // barras animadas
  kpis?: Kpi[]; // contadores animados
  segundos?: number; // si hay narración se calcula solo
  transicion?: Transition;
  // los rellena build.mjs:
  voz?: string; // ruta dentro de public
  vozInicio?: number;
  palabras?: Word[];
};

export type Marca = {nombre?: string; logo?: string}; // logo: archivo en public/img

export type VideoSpec = {
  formato: 'horizontal' | 'vertical';
  musica?: string; // archivo en public
  volumenMusica?: number;
  volumenPista?: number; // lo calcula build.mjs
  pista?: string; // música real (archivo en public, p. ej. music/corporate.mp3); va bajo la voz y los efectos
  colores?: [string, string, string];
  marca?: Marca;
  escenas: Scene[];
};
