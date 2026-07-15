/**
 * Elevation-aware surfaces — React Native reference implementation.
 *
 * Mirrors the Figma `Surface` variable-mode system: a component's foreground
 * (text / icon / button colors) resolves from the SURFACE it sits on, inherited
 * from its parent, instead of being hand-picked per placement.
 *
 * Three axes resolve a foreground value:  Theme × Scheme × Surface.
 *   - Theme/Scheme come from your existing ThemeProvider + useColorScheme().
 *   - Surface is the new axis, provided here by <Surface level="…">.
 *
 * See docs/elevation-aware-surfaces.md.
 */
import React, { createContext, useContext } from 'react';
import { View, Text, useColorScheme, type ViewProps } from 'react-native';

export type SurfaceLevel = 'canvas' | 'container' | 'card';
export type Scheme = 'light' | 'dark';

/**
 * Foreground token table. Generated from the DTCG token JSON at build time —
 * each value here is a resolved hex for [scheme][surface]. Shown inline for the
 * Brandy Blue theme; in production this is keyed by theme too:
 *   tokens[theme].foreground[scheme][surface]
 *
 * The values intentionally reuse the existing on-canvas / on-surface families:
 *   canvas  -> on-canvas family (light in dark scheme)
 *   container/card -> on-surface family (dark in both schemes; cards are light islands)
 */
export const foregroundTokens = {
  default: {
    light: { canvas: '#1C2C32', container: '#1C2C32', card: '#1C2C32' },
    dark:  { canvas: '#FAFBFC', container: '#1C2C32', card: '#1C2C32' },
  },
  variant: {
    light: { canvas: '#5F737B', container: '#5F737B', card: '#5F737B' },
    dark:  { canvas: '#A5B0B8', container: '#5F737B', card: '#5F737B' },
  },
  accent: {
    light: { canvas: '#006073', container: '#006073', card: '#006073' },
    dark:  { canvas: '#9EDADF', container: '#006073', card: '#006073' },
  },
} as const;

/** Primary button fill/label per surface — the "different color in a container vs canvas" case. */
export const primaryTokens = {
  fill:  { light: { canvas: '#006073', container: '#006073', card: '#006073' },
           dark:  { canvas: '#9EDADF', container: '#006073', card: '#006073' } },
  label: { light: { canvas: '#FFFFFF', container: '#FFFFFF', card: '#FFFFFF' },
           dark:  { canvas: '#002C38', container: '#FFFFFF', card: '#FFFFFF' } },
} as const;

export type ForegroundRole = keyof typeof foregroundTokens;

const SurfaceContext = createContext<SurfaceLevel>('canvas');

/** Wrap a subtree to declare the surface its children sit on. Mirrors "set mode on the frame". */
export function Surface({ level, children, ...rest }: ViewProps & { level: SurfaceLevel }) {
  return (
    <SurfaceContext.Provider value={level}>
      <View {...rest}>{children}</View>
    </SurfaceContext.Provider>
  );
}

export function useSurface(): SurfaceLevel {
  return useContext(SurfaceContext);
}

/** Resolve a foreground color for the current surface + scheme. */
export function useForeground(role: ForegroundRole = 'default'): string {
  const surface = useSurface();
  const scheme: Scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return foregroundTokens[role][scheme][surface];
}

/** Resolve the primary button colors for the current surface + scheme. */
export function usePrimary() {
  const surface = useSurface();
  const scheme: Scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { fill: primaryTokens.fill[scheme][surface], label: primaryTokens.label[scheme][surface] };
}

/* ---------------------------------------------------------------------------
 * Example — the SAME components in two surfaces, no variant swap:
 *
 *   <Surface level="canvas" style={{ backgroundColor: canvasBg }}>
 *     <AppText>Title on canvas</AppText>          // light in dark scheme
 *     <PrimaryButton label="Book" />              // bright fill, dark label
 *
 *     <Surface level="card" style={{ backgroundColor: cardBg }}>
 *       <AppText>Text in a card</AppText>          // dark in both schemes
 *       <PrimaryButton label="Pay" />              // dark fill, white label
 *     </Surface>
 *   </Surface>
 * ------------------------------------------------------------------------- */

export function AppText({ role = 'default', style, ...rest }:
  React.ComponentProps<typeof Text> & { role?: ForegroundRole }) {
  const color = useForeground(role);
  return <Text {...rest} style={[{ color }, style]} />;
}
