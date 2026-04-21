import type { Radius } from "../types/radius";

export function generateBorderRadius(
    radius: Radius,
    isEllipse: boolean = false
): string {
    const { topLeft, topRight, bottomLeft, bottomRight, topLeftY, topRightY, bottomLeftY, bottomRightY } = radius;

    if (isEllipse) {
        return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px / ${topLeftY}px ${topRightY}px ${bottomRightY}px ${bottomLeftY}px`;
    }

    return `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
};