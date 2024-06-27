export function negativeModulo(numerator: number, denominator: number): number {
    let result = numerator % denominator;
    if (result < 0) {
      result = result + denominator
    }
    return result;
  }