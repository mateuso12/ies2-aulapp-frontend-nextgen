declare module 'xpath-range' {
  // API: fromRange returns { start: string, end: string, startOffset: number, endOffset: number }
  export interface SerializedRange {
    start: string
    end: string
    startOffset: number
    endOffset: number
  }

  // fromRange(range, [root]) - serializes a DOM Range to XPath + offsets
  export function fromRange(range: Range, root?: Node): SerializedRange

  // toRange(startPath, startOffset, endPath, endOffset, [root]) - reconstructs a DOM Range
  export function toRange(
    start: string,
    startOffset: number,
    end: string,
    endOffset: number,
    root?: Node
  ): Range
}
