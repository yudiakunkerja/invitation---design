import React from 'react';

interface QrCodeViewProps {
  value: string;
  size?: number;
  className?: string;
  sublabel?: string;
}

/**
 * High-clarity geometric QR Code SVG component.
 * Produces crisp, deterministic 2D matrix squares based on input hash,
 * complete with standard QR position finder patterns in the corners.
 */
export const QrCodeView: React.FC<QrCodeViewProps> = ({
  value,
  size = 180,
  className = '',
  sublabel,
}) => {
  // Deterministic seed generation
  let seed = 0;
  for (let i = 0; i < value.length; i++) {
    seed = (seed << 5) - seed + value.charCodeAt(i);
    seed |= 0;
  }

  const gridSize = 21; // Standard QR Version 1 size (21x21)
  const matrix: boolean[][] = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill(false)
  );

  // Helper to draw corner finder patterns
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        } else {
          matrix[startY + r][startX + c] = false;
        }
      }
    }
  };

  // Draw 3 corner finders
  drawFinder(0, 0);
  drawFinder(gridSize - 7, 0);
  drawFinder(0, gridSize - 7);

  // Timing patterns
  for (let i = 8; i < gridSize - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Fill data cells with pseudo-random deterministic pseudo bitstream based on value seed
  let currentHash = Math.abs(seed);
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Don't overwrite finders or timing patterns
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= gridSize - 8;
      const isBottomLeft = r >= gridSize - 8 && c < 8;
      const isTiming = r === 6 || c === 6;

      if (!isTopLeft && !isTopRight && !isBottomLeft && !isTiming) {
        currentHash = (currentHash * 9301 + 49297) % 233280;
        matrix[r][c] = currentHash % 2 === 0;
      }
    }
  }

  return (
    <div className={`inline-flex flex-col items-center bg-white p-3 rounded-xl border border-stone-200 shadow-sm ${className}`}>
      <svg
        viewBox={`0 0 ${gridSize} ${gridSize}`}
        width={size}
        height={size}
        className="shape-rendering-crispEdges"
      >
        <rect width={gridSize} height={gridSize} fill="#FFFFFF" />
        {matrix.map((row, r) =>
          row.map((filled, c) =>
            filled ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width={1}
                height={1}
                fill="#1C1917"
              />
            ) : null
          )
        )}
      </svg>
      {sublabel && (
        <span className="text-[11px] font-mono font-medium text-stone-600 mt-2 tracking-wider">
          {sublabel}
        </span>
      )}
    </div>
  );
};
