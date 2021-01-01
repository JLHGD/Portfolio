import * as classes from './classes.js';

let canvasElement;
let points = [];
let pointsFinished = 0;
const maxPoints = 15;
let currentTime;
let previousTime = 0;
let timeElapsed = 0;
let requestFrameID;

// Vue
let app = new Vue({
	el: '#root',
	data: {
        ctx: {},
        drawToggle: true
	},
    methods:{
        draw(){
            if(points.length == 0){
                points = [createBeginningPoint()];
                requestFrameID = requestAnimationFrame(this.draw);
                this.ctx.save();
                this.ctx.fillStyle = "#000";
                this.ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
                this.ctx.restore();
                previousTime = Date.now();
            }
            else if(this.drawToggle && pointsFinished != points.length){
                requestFrameID = requestAnimationFrame(this.draw);
                drawBackground(this.ctx);
            }
        },
        resetCanvas(){
            cancelAnimationFrame(requestFrameID);
            this.ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            this.ctx.save();
            this.ctx.fillStyle = "#000";
            this.ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
            this.ctx.restore();
            points = [createBeginningPoint()];
            pointsFinished = 0;
            if(this.drawToggle){
                this.draw();
            }
        }
    },

    mounted(){
        canvasElement = document.querySelector("canvas");
        this.ctx = canvasElement.getContext("2d");
        this.draw();
    }
});

function init(){

}

function drawBackground(ctx){
    //ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // let x = Math.floor(Math.random() * (canvasElement.width+1));
    // let y = Math.floor(Math.random() * (canvasElement.height+1));

    // Calculate the elapsed time
    currentTime = Date.now();
    timeElapsed += currentTime - previousTime;
    previousTime = currentTime;

    // ctx.save();
    // ctx.fillStyle = "#000";
    // ctx.globalAlpha = 0.001;
    // ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    // ctx.restore();

    pointsFinished = 0;
    for(let i = 0; i < points.length; i++){
        if(points[i].x > canvasElement.width || points[i].x < 0 || points[i].y > canvasElement.height || points[i].y < 0){
            pointsFinished++;
        }
        else{
            // If one second has passed, see if the point will switch direction or spawn a new point
            if(timeElapsed >= 1000){
                // Switch direction
                if(getRandomInt(0, 100) <= points[i].switchChance){
                    points[i].switchNum++;
                }
                // Create new point
                if(getRandomInt(0, 100) <= points[i].spawnChance && points.length <= maxPoints){
                    points.push(new classes.Point(points[i].x, points[i].y, getRandomInt(-1, 1), getRandomInt(-1, 1), Math.round(points[i].spawnChance/2), 30));
                }
                // Reset the timer
                timeElapsed = 0;
            }
            // If the total number of switches isn't reached
            if(points[i].switchNum != points[i].switchMax || points[i].switchMax == 0){
                // If it's an odd number of switches, then switch to y
                if(points[i].switchNum%2 != 0){
                    points[i].y += points[i].yDir
                }
                else{
                    points[i].x += points[i].xDir
                }
            }
            // Otherwise, switch to x
            else{
                points[i].x += points[i].xDir
            }

            ctx.save();
            ctx.fillStyle = "#FFF";
            ctx.fillRect(points[i].x, points[i].y, 2, 2);
            ctx.restore();

        }
    }

}

function getRandomInt(min, max){
    // https://www.w3schools.com/js/js_random.asp
    return Math.floor(Math.random() * (max-min+1))+min;
}

function createBeginningPoint(){
    let randomYCoord = getRandomInt(0, canvasElement.height);
    if(randomYCoord <= canvasElement.height/2){
        return new classes.Point(0, randomYCoord, 1, 1, 75, 30, 0, 2);
    }
    else{
        return new classes.Point(0, randomYCoord, 1, -1, 75, 30, 0, 2);
    }
}

export {init};
