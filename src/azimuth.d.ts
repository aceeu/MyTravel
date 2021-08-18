
declare module 'azimuth' {

    export interface Point {
        lat: number;
        lng: number;
        elv: number;
    }

    export interface Result {
        distance: number;
        azimuth: number;
        altitude: number;
    }

    export function azimuth(a: Point, b: Point): Result;
}
