import type { Radius } from "../types/radius";

export function generateBorderRadius(radius: Radius): string {
    const { topLeft, topRight, bottomLeft, bottomRight } = radius;
    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
};