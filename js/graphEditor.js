class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas;
    this.graph = graph;

    this.ctx = this.canvas.getContext("2d");

    this.selected = null;
    this.hovered = null;
    this.dragging = false;
    this.mouse = 0;

    this.#addEventListeners();
  }

  #addEventListeners() {
    this.canvas.addEventListener("mousedown", (evt) => {
      if (evt.button == 2) {
        // right click
        if (this.hovered) {
          this.#removePoint(this.hovered);
        } else {
          this.selected = null;
        }
      }
      if (evt.button == 0) {
        // left click

        if (this.hovered) {
          this.#select(this.hovered);
          this.dragging = true;
          return;
        }
        this.graph.addPoint(this.mouse);
        this.#select(this.mouse);
        this.hovered = this.mouse;
      }
    });

    this.canvas.addEventListener("mousemove", (evt) => {
      this.mouse = new Point(evt.offsetX, evt.offsetY);
      this.hovered = getNearestPoint(this.mouse, this.graph.points, 10);

      if (this.dragging == true) {
        this.selected.x = this.mouse.x;
        this.selected.y = this.mouse.y;
      }
    });

    this.canvas.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
    });
    this.canvas.addEventListener("mouseup", () => {
      this.dragging = false;
    });
  }

  #select(point) {
    //добавляем сигмент от выслеенной точки до указанной
    // если есть выделение до этого
    if (this.selected) {
      this.graph.tryAddSegment(new Segment(this.selected, point));
    }
    // выделяем точку
    this.selected = point;
  }

  #removePoint(point) {
    this.graph.removePoint(point);
    this.hovered = null;
    if (this.selected == point) {
      this.selected = null;
    }
  }

  display() {
    this.graph.draw(this.ctx);
    if (this.hovered) {
      this.hovered.draw(this.ctx, { fill: true });
    }
    if (this.selected) {
      const intent = this.hovered ? this.hovered : this.mouse;
      new Segment(this.selected, intent).draw(this.ctx, { dash: [3, 3] });
      this.selected.draw(this.ctx, { outline: true });
    }
  }
}
