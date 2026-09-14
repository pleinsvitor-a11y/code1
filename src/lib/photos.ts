/**
 * The four real photos live in src/assets/photos/. Each slot renders only when
 * its file exists, so the build never fails and nothing is ever a placeholder.
 *
 *   hero-mao-no-queixo.jpg   B&W portrait, hand on chin      → Hero
 *   vitor-sentado.jpg        smiling, seated, hands clasped  → Vitor
 *   vitor-bracos-cruzados.jpg serious, arms crossed          → (reserved)
 *   vitor-tijolos.jpg        white shirt, brick wall         → only desaturated, if it passes review
 */
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<ImageMetadata>('/src/assets/photos/*.{jpg,jpeg,png}', { eager: true, import: 'default' });

export function photo(name: string): ImageMetadata | undefined {
  return files[`/src/assets/photos/${name}`];
}
