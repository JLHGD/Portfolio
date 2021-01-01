class Point {
    constructor(x, y, xDir, yDir, spawnChance, switchChance, switchNum=0, switchMax=0){
        this.x = x;
        this.y = y;
        this.xDir = xDir;
        this.yDir = yDir;
        this.spawnChance = spawnChance;
        this.switchChance = switchChance;
        this.switchNum = switchNum;
        this.switchMax = switchMax;
    }
}

export {Point};
