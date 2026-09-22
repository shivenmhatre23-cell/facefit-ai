/**
 * Photorealistic hair and garment rendering generator for FaceFit AI Studio
 * Generates organic, multi-layered feathered strand clusters and natural lighting.
 */

export interface HairStyleConfig {
  name: string;
  category: 'crop' | 'fade' | 'quiff' | 'fringe' | 'buzz' | 'curls' | 'sidepart';
  defaultColor: string;
  strandCount: number;
}

export interface RenderTransform {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation?: number;
  opacity?: number;
}

export function getHairColors(colorHex?: string): {
  base: string;
  shadow: string;
  highlight: string;
  sheen: string;
} {
  const hex = (colorHex || '#1C1714').toLowerCase();

  if (hex.includes('chestnut') || hex === '#4a3728' || hex === '#452e23') {
    return {
      shadow: '#1A110C',
      base: '#2E1E17',
      highlight: '#52372A',
      sheen: '#734E3C',
    };
  }

  if (hex === '#1b1816' || hex === '#0f0e0d' || hex === '#111111') {
    return {
      shadow: '#080706',
      base: '#141211',
      highlight: '#292523',
      sheen: '#3D3835',
    };
  }

  // Default: Rich Natural Dark Espresso
  return {
    shadow: '#100D0B',
    base: '#1C1714',
    highlight: '#362D27',
    sheen: '#4F4239',
  };
}

/**
 * Generates realistic SVG hair cluster with organic strand curves,
 * soft roots, layered depth, and volumetric highlights.
 */
export function generateRealisticHairSVG(
  styleName: string,
  colorHex: string,
  transform: RenderTransform
): string {
  const colors = getHairColors(colorHex);
  const nameLower = (styleName || '').toLowerCase();

  const { x = 300, y = 260, scaleX = 1.0, scaleY = 1.0, opacity = 0.96 } = transform;

  // Render style-specific realistic hair clusters
  let hairStrands = '';

  if (nameLower.includes('quiff') || nameLower.includes('pompadour') || nameLower.includes('volume')) {
    // Upward sweeping textured quiff
    hairStrands = `
      <!-- Base Soft Scalp Shadow -->
      <path d="M 210 240 C 200 140, 310 90, 390 120 C 400 160, 395 220, 380 250 C 350 200, 330 170, 300 170 C 260 170, 230 200, 210 240 Z" fill="${colors.shadow}" opacity="0.85" filter="url(#featherGlow)"/>
      <!-- Mid-tone Body Volume -->
      <path d="M 215 230 C 210 135, 305 105, 385 130 C 390 170, 385 210, 375 240 C 350 195, 320 165, 295 165 C 255 165, 230 195, 215 230 Z" fill="${colors.base}"/>
      <!-- Upward Sweeping Strand Layers -->
      ${Array.from({ length: 45 })
        .map((_, i) => {
          const startX = 220 + i * 3.6;
          const endX = startX + (i < 22 ? -15 + i * 0.5 : 10 + (i - 22) * 0.8);
          const startY = 220 - Math.sin((i / 45) * Math.PI) * 20;
          const endY = 120 - Math.sin((i / 45) * Math.PI) * 25 + (i % 3) * 6;
          const ctrlX = (startX + endX) / 2 + (i % 2 === 0 ? 8 : -8);
          const ctrlY = startY - 45;
          const strokeColor = i % 4 === 0 ? colors.sheen : i % 2 === 0 ? colors.highlight : colors.base;
          const width = 1.8 + (i % 3) * 0.7;
          const op = 0.55 + (i % 5) * 0.08;
          return `<path d="M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}" stroke="${strokeColor}" stroke-width="${width}" fill="none" stroke-linecap="round" opacity="${op}"/>`;
        })
        .join('\n')}
      <!-- Soft Taper Blends on Sides -->
      <path d="M 210 235 Q 215 285 220 310 Q 225 275 228 245 Z" fill="url(#taperFadeLeft)" opacity="0.88"/>
      <path d="M 390 235 Q 385 285 380 310 Q 375 275 372 245 Z" fill="url(#taperFadeRight)" opacity="0.88"/>
    `;
  } else if (nameLower.includes('buzz') || nameLower.includes('crew')) {
    // Clean, natural uniform buzz cut with soft scalp fade
    hairStrands = `
      <!-- Soft Scalp Base -->
      <path d="M 215 240 C 210 160, 390 160, 385 240 C 375 210, 340 190, 300 190 C 260 190, 225 210, 215 240 Z" fill="${colors.shadow}" opacity="0.9" filter="url(#featherGlow)"/>
      <path d="M 218 235 C 215 165, 385 165, 382 235 C 370 205, 340 185, 300 185 C 260 185, 230 205, 218 235 Z" fill="${colors.base}" opacity="0.85"/>
      <!-- Organic Micro Texture Follicles -->
      ${Array.from({ length: 60 })
        .map((_, i) => {
          const px = 225 + (i % 15) * 10.5 + (Math.floor(i / 15) % 2) * 5;
          const py = 160 + Math.floor(i / 15) * 16;
          return `<circle cx="${px}" cy="${py}" r="${1.2 + (i % 2) * 0.4}" fill="${i % 3 === 0 ? colors.highlight : colors.base}" opacity="0.75"/>`;
        })
        .join('\n')}
      <!-- Natural Temple Gradient -->
      <path d="M 215 240 Q 218 285 222 305 Q 225 275 228 245 Z" fill="url(#taperFadeLeft)" opacity="0.8"/>
      <path d="M 385 240 Q 382 285 378 305 Q 375 275 372 245 Z" fill="url(#taperFadeRight)" opacity="0.8"/>
    `;
  } else if (nameLower.includes('wolf') || nameLower.includes('curtain') || nameLower.includes('shag') || nameLower.includes('fringe')) {
    // Layered Textured Fringe / Wolf Cut with organic locks framing the face
    hairStrands = `
      <!-- Crown Density -->
      <path d="M 205 240 C 195 140, 405 140, 395 240 C 380 205, 350 170, 300 170 C 250 170, 220 205, 205 240 Z" fill="${colors.shadow}" opacity="0.9" filter="url(#featherGlow)"/>
      <path d="M 210 235 C 205 145, 395 145, 390 235 C 375 200, 345 175, 300 175 C 255 175, 225 200, 210 235 Z" fill="${colors.base}"/>
      <!-- Layered Feathered Fringe Strands Dropping Naturally -->
      ${Array.from({ length: 50 })
        .map((_, i) => {
          const startX = 215 + i * 3.5;
          const drop = Math.sin((i / 50) * Math.PI) * 45;
          const endX = startX + (i < 25 ? -12 + (i / 25) * 6 : 6 + ((i - 25) / 25) * 12);
          const startY = 175 + Math.sin((i / 50) * Math.PI) * 15;
          const endY = startY + drop + (i % 4) * 4;
          const ctrlX = (startX + endX) / 2 + (i % 2 === 0 ? 5 : -5);
          const ctrlY = startY + drop * 0.6;
          const color = i % 4 === 0 ? colors.sheen : i % 2 === 0 ? colors.highlight : colors.base;
          return `<path d="M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}" stroke="${color}" stroke-width="${1.8 + (i % 3) * 0.8}" fill="none" stroke-linecap="round" opacity="${0.65 + (i % 4) * 0.08}"/>`;
        })
        .join('\n')}
      <!-- Ear Feathering Sideburns -->
      <path d="M 205 240 Q 200 280 206 305 Q 212 280 216 250 Z" fill="${colors.base}" opacity="0.85"/>
      <path d="M 395 240 Q 400 280 394 305 Q 388 280 384 250 Z" fill="${colors.base}" opacity="0.85"/>
    `;
  } else {
    // Default: Modern Textured Crop with Low Taper Fade
    hairStrands = `
      <!-- Crown Volume Base with Soft Shadow -->
      <path d="M 208 240 C 200 135, 400 135, 392 240 C 380 205, 350 170, 300 170 C 250 170, 220 205, 208 240 Z" fill="${colors.shadow}" opacity="0.9" filter="url(#featherGlow)"/>
      <path d="M 212 235 C 208 140, 392 140, 388 235 C 375 200, 345 175, 300 175 C 255 175, 225 200, 212 235 Z" fill="${colors.base}"/>
      
      <!-- Multi-Layer Forward Point-Cut Strands -->
      ${Array.from({ length: 55 })
        .map((_, i) => {
          const startX = 218 + i * 3.1;
          const startY = 175 + Math.sin((i / 55) * Math.PI) * 20;
          const length = 28 + Math.sin((i / 55) * Math.PI) * 18 + (i % 4) * 3;
          const endX = startX + (i % 3 === 0 ? 3 : i % 2 === 0 ? -3 : 0);
          const endY = startY + length;
          const ctrlX = (startX + endX) / 2 + (i % 2 === 0 ? 4 : -4);
          const ctrlY = (startY + endY) / 2;
          const color = i % 4 === 0 ? colors.sheen : i % 2 === 0 ? colors.highlight : colors.base;
          const width = 1.9 + (i % 3) * 0.6;
          return `<path d="M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" opacity="${0.7 + (i % 4) * 0.08}"/>`;
        })
        .join('\n')}

      <!-- Soft Point-cut Fringe Tips (Irregular natural finish) -->
      ${Array.from({ length: 18 })
        .map((_, i) => {
          const fx = 230 + i * 8 + (i % 2) * 3;
          const fy = 222 + Math.sin((i / 18) * Math.PI) * 8 + (i % 3) * 4;
          return `<path d="M ${fx} ${fy - 12} L ${fx + (i % 2 === 0 ? 2 : -2)} ${fy}" stroke="${colors.highlight}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
        })
        .join('\n')}

      <!-- Skin Taper Fade Transitions -->
      <path d="M 206 240 Q 212 290 216 312 Q 222 280 226 248 Z" fill="url(#taperFadeLeft)" opacity="0.88"/>
      <path d="M 394 240 Q 388 290 384 312 Q 378 280 374 248 Z" fill="url(#taperFadeRight)" opacity="0.88"/>
    `;
  }

  return `
    <g transform="translate(${x}, ${y}) scale(${scaleX}, ${scaleY}) translate(-300, -220)" opacity="${opacity}">
      ${hairStrands}
    </g>
  `;
}
