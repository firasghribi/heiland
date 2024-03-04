"use strict";

const DOT_SIZE = 11;

const $ = (str) => document.querySelectorAll(str);

const selectPoint = function (e) {
  this.parentScope.selectedPoint = this;
};

const unselectPoint = function (e) {
  this.selectedPoint = null;
};

const drawPoint = (x, y, draw, scope) => {
  const group = draw.group().move(x - DOT_SIZE / 2, y - DOT_SIZE / 2);
  const text = group.text(`x:${x}, y:${y}`);
  const _scope = { obj: group, text: text, pos: [x, y], parentScope: scope };

  group
    .circle(DOT_SIZE)
    .stroke("red")
    .fill("red")
    .on("mousedown", selectPoint, _scope);

  return _scope;
};

const drawParallelogram = (posArr, draw) => ({
  obj: draw
    .polygon("")
    .plot(Mathematic.getParallelogramCoord(posArr))
    .fill("transparent")
    .stroke("blue")
    .back(),
  pos: posArr,
  centroid: Mathematic.getParallelogramCentroid(posArr),
  area: Mathematic.getParallelogramArea(posArr),
});

const drawCircle = (pos, area, draw) => {
  const radius = Mathematic.getCircleRadius(area);
  const group = draw
    .group()
    .move(pos[0] - radius, pos[1] - radius)
    .back();

  group
    .circle(radius * 2)
    .fill("transparent")
    .stroke("#eab308");
  const text = group.text(`x:${pos[0]}, y:${pos[1]}`).move(radius / 2, radius);
  return {
    obj: group,
    text: text,
    pos: pos,
  };
};

const redraw = function (e) {
  if (this.selectedPoint) {
    const p = this.selectedPoint;
    const x = e.pageX;
    const y = e.pageY;
    p.obj.move(x - DOT_SIZE / 2, y - DOT_SIZE / 2);
    p.text.plain(`x:${x}, y:${y}`);
    p.pos[0] = x;
    p.pos[1] = y;
    resetFigure.bind(this)();
  }
};

const resetFigure = function () {
  this.parallelogram.obj.remove();
  this.circle.obj.remove();
  this.circle = null;
  this.parallelogram = null;
};

const onClickFirst = function (e) {
  if (this.dotArr.length < 3) {
    const x = e.pageX;
    const y = e.pageY;
    this.dotArr.push(drawPoint(x, y, this.draw, this));
  }

  if (this.dotArr.length === 3 && !this.parallelogram) {
    $("#reset")[0].style.display = "";
    this.parallelogram = drawParallelogram(
      this.dotArr.map((i) => i.pos),
      this.draw
    );
    this.circle = drawCircle(
      this.parallelogram.centroid,
      this.parallelogram.area,
      this.draw
    );
  }
};

const reset = function () {
  this.dotArr.forEach((i) => i.obj.remove());
  resetFigure.bind(this)();
  this.dotArr.length = 0;
  this.selectedPoint = null;

  $("#canvas")[0].innerHTML = null;
  this.draw = SVG("canvas").size("100%", "100%");
  this.draw.on("click", onClickFirst, this);
  this.draw.on("mousemove", redraw, this);
  this.draw.on("mouseup", unselectPoint, this);

  $("#reset")[0].style.display = $(".about")[0].style.display = "none";
  $("#about")[0].style.display = "";
};

(function () {
  $("#canvas")[0].innerHTML = null;

  const scope = {
    draw: SVG("canvas").size("100%", "100%"),
    dotArr: [],
  };

  scope.draw.on("click", onClickFirst, scope);
  scope.draw.on("mousemove", redraw, scope);
  scope.draw.on("mouseup", unselectPoint, scope);

  $("#reset")[0].addEventListener("click", reset.bind(scope));
  $("#about")[0].addEventListener("click", function () {
    $(".about")[0].style.display = "";
    $("#about")[0].style.display = "none";
  });
})();
