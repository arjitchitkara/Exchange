declare module 'react-sparklines' {
  import { ReactNode } from 'react';

  export interface SparklineProps {
    data: number[];
    limit?: number;
    width?: number;
    height?: number;
    svgWidth?: number;
    svgHeight?: number;
    preserveAspectRatio?: string;
    margin?: number;
    min?: number;
    max?: number;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  export interface SparklineLineProps {
    color?: string;
    style?: React.CSSProperties;
  }

  export const Sparklines: React.FC<SparklineProps>;
  export const SparklinesLine: React.FC<SparklineLineProps>;
} 