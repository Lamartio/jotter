export function lastElement<T>(element: T, index: number, array: T[]): boolean {
    return index < array.length - 1
}

export function arrayOf(length: number): any[] {
    return new Array(length).fill(undefined)
}