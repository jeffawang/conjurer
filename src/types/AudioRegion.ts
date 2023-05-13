export class AudioRegion {
  start: number;
  end: number;
  content: string;
  color: string;

  constructor({
    start,
    end,
    content,
    color,
  }: {
    start: number;
    end: number;
    content: string;
    color: string;
  }) {
    this.start = start;
    this.end = end;

    this.content = content;
    this.color = color;
  }
}
