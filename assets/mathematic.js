Mathematic = {
    getParallelogramCoord: function(pos){
        if(!pos.length) return;

        const [x1, y1] = pos[0];
        const [x2, y2] = pos[1];
        const [x3, y3] = pos[2];
        const x = x1 - x2 + x3;
        const y = y1 - y2 + y3;
        pos[3] = [x, y];
        return pos;
    },
    getParallelogramCentroid: function(parallelogramCoord){
        const sumX = parallelogramCoord.reduce((sum, coord) => sum + coord[0], 0);
        const sumY = parallelogramCoord.reduce((sum, coord) => sum + coord[1], 0);
        return [
            sumX / 4, //X
            sumY / 4  //Y
        ];
    },
    getCircleRadius: function(circleArea){
        return Math.sqrt(circleArea / Math.PI);
    },
    getPolygonArea: function(polygonCoord){
        if(polygonCoord.length < 3) return 0;
        let area = 0;
        for (let i = 0; i < polygonCoord.length; i++) {
            const [x1, y1] = polygonCoord[i];
            const [x2, y2] = polygonCoord[i + 1] || polygonCoord[0];
            area += x1 * y2 - y1 * x2;
        }
        return Math.abs(area) / 2;
    },

    getParallelogramArea: function(parallelogramCoord){ return this.getPolygonArea(parallelogramCoord);}
};