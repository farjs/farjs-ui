export interface ListViewport {
  readonly offset: number;
  readonly focused: number;
  readonly length: number;
  readonly viewLength: number;
  updated(offset: number, focused?: number): ListViewport;
  down(): ListViewport;
  up(): ListViewport;
  pagedown(): ListViewport;
  pageup(): ListViewport;
  end(): ListViewport;
  home(): ListViewport;
  onKeypress(keyFull: string): ListViewport | undefined;
  resize(viewLength: number): ListViewport;
}
