export function getStep(distance: number, parts: number): number {
    const step = distance/parts;
    let stepKm = Math.round(step / 1000);
    stepKm = stepKm > 10 ? Math.round(stepKm / 10) * 10: stepKm;
    return stepKm * 1000;
}