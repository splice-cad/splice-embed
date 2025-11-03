/**
 * @splice-cad/embed
 *
 * Embed Splice harness diagrams on your website
 */

export interface EmbedOptions {
  /** API base URL (default: https://splice-cad.com) */
  apiUrl?: string;
  /** Width of container (default: '100%') */
  width?: string;
  /** Height of container (default: '600px') */
  height?: string;
  /** Canvas background color (hex format, default: #ffffff) */
  canvasColor?: string;
  /** Show grid overlay */
  showGrid?: boolean;
  /** Grid color (hex format, default: #ddd) */
  gridColor?: string;
  /** Show BOM table below diagram */
  showBOM?: boolean;
  /** BOM position: 'top', 'bottom', 'left', 'right' (default: 'bottom') */
  bomPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Show harness title */
  showTitle?: boolean;
  /** Custom title to display (overrides harness name) */
  title?: string;
  /** Enable interactive pan/zoom */
  interactive?: boolean;
  /** Controls position: 'top-right', 'top-left', 'bottom-right', 'bottom-left' (default: 'top-right') */
  controlsPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** Zoom configuration */
  zoom?: {
    initial?: number;
    min?: number;
    max?: number;
  };
  /** Custom style overrides */
  styles?: {
    backgroundColor?: string;
    textColor?: string;
    connectorFill?: string;
    connectorStroke?: string;
    wireStroke?: string;
    hoverColor?: string;
  };
  /** Callback when harness loads */
  onLoad?: (harness: any) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
}

export interface EmbedController {
  zoomIn(): void;
  zoomOut(): void;
  fitToView(): void;
  destroy(): void;
  update(options: Partial<EmbedOptions>): void;
}

interface HarnessData {
  id: string;
  name: string;
  description?: string;
  bom: any;
  data: {
    mapping: any;
    connector_positions: any;
    cable_positions?: any;
    wire_anchors?: any;
    design_notes?: any;
  };
}

/**
 * Main entry point for embedding harnesses
 *
 * @param containerId - ID of the HTML element to embed into
 * @param harnessIdOrToken - Either a harness UUID (public only) or share token (private)
 * @param options - Optional configuration
 */
export function embed(
  containerId: string,
  harnessIdOrToken: string,
  options: EmbedOptions = {}
): EmbedController {
  const apiUrl = options.apiUrl || 'https://splice-cad.com';
  const container = document.getElementById(containerId);

  if (!container) {
    const error = new Error(`Container element #${containerId} not found`);
    options.onError?.(error);
    throw error;
  }

  // Set container dimensions
  container.style.width = options.width || '100%';
  container.style.height = options.height || '600px';
  container.style.position = 'relative';
  container.style.overflow = 'hidden';

  // Create iframe to render the harness
  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.style.display = 'block';

  // Build embed URL - backend validates auth and redirects to frontend
  // harnessIdOrToken can be either:
  // - Harness UUID (for public harnesses only)
  // - Share token (32 chars, for private harnesses)
  const embedUrl = new URL(`${apiUrl}/api/embed/${harnessIdOrToken}`);
  if (options.canvasColor) {
    embedUrl.searchParams.set('canvasColor', options.canvasColor);
  }
  if (options.showGrid !== undefined) {
    embedUrl.searchParams.set('showGrid', String(options.showGrid));
  }
  if (options.gridColor) {
    embedUrl.searchParams.set('gridColor', options.gridColor);
  }
  if (options.showBOM !== undefined) {
    embedUrl.searchParams.set('showBOM', String(options.showBOM));
  }
  if (options.bomPosition) {
    embedUrl.searchParams.set('bomPosition', options.bomPosition);
  }
  if (options.showTitle !== undefined) {
    embedUrl.searchParams.set('showTitle', String(options.showTitle));
  }
  if (options.title) {
    embedUrl.searchParams.set('title', options.title);
  }
  if (options.interactive !== undefined) {
    embedUrl.searchParams.set('interactive', String(options.interactive));
  }
  if (options.controlsPosition) {
    embedUrl.searchParams.set('controlsPosition', options.controlsPosition);
  }

  iframe.src = embedUrl.toString();
  container.appendChild(iframe);

  // Controller state
  let currentZoom = options.zoom?.initial || 1;
  const minZoom = options.zoom?.min || 0.1;
  const maxZoom = options.zoom?.max || 5;

  // Post message to iframe for control
  const postMessage = (action: string, data?: any) => {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage({ action, data }, apiUrl);
    }
  };

  // Handle iframe load
  iframe.onload = () => {
    options.onLoad?.({ id: harnessIdOrToken });
  };

  // Handle iframe errors
  iframe.onerror = () => {
    const error = new Error(`Failed to load harness: ${harnessIdOrToken}`);
    options.onError?.(error);
  };

  // Return controller
  return {
    zoomIn: () => {
      currentZoom = Math.min(currentZoom * 1.2, maxZoom);
      postMessage('zoom', { level: currentZoom });
    },
    zoomOut: () => {
      currentZoom = Math.max(currentZoom / 1.2, minZoom);
      postMessage('zoom', { level: currentZoom });
    },
    fitToView: () => {
      currentZoom = 1;
      postMessage('fitToView');
    },
    destroy: () => {
      container.removeChild(iframe);
    },
    update: (newOptions: Partial<EmbedOptions>) => {
      // Merge options
      Object.assign(options, newOptions);

      // Update iframe src with new options
      const newUrl = new URL(`${apiUrl}/api/embed/${harnessIdOrToken}`);
      if (options.canvasColor) newUrl.searchParams.set('canvasColor', options.canvasColor);
      if (options.showGrid !== undefined) newUrl.searchParams.set('showGrid', String(options.showGrid));
      if (options.gridColor) newUrl.searchParams.set('gridColor', options.gridColor);
      if (options.showBOM !== undefined) newUrl.searchParams.set('showBOM', String(options.showBOM));
      if (options.bomPosition) newUrl.searchParams.set('bomPosition', options.bomPosition);
      if (options.showTitle !== undefined) newUrl.searchParams.set('showTitle', String(options.showTitle));
      if (options.title) newUrl.searchParams.set('title', options.title);
      if (options.interactive !== undefined) newUrl.searchParams.set('interactive', String(options.interactive));
      if (options.controlsPosition) newUrl.searchParams.set('controlsPosition', options.controlsPosition);

      iframe.src = newUrl.toString();
    },
  };
}

// Global API when loaded via CDN
if (typeof window !== 'undefined') {
  (window as any).Splice = { embed };
}

export default { embed };
