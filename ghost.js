class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetIndex = parseInt(
            Math.random() * randomTargetForGhosts.length
        );
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }
    changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex %= 4;
    }

    moveProcess() {
        if(this.isInRangeOfPacman()) {
            this.target = pacman;
        } else {
            this.target = randomTargetForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();   
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
        }
    }
    
    isInRangeOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    moveBackwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_DOWN:
                this.y -= this.speed;
                break; 
        }
    }
    moveForwards() {
        switch(this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_DOWN:
                this.y += this.speed;
                break; 
        } 
    }
    checkCollision() {
        if(map[this.getMapY()][this.getMapX()] == 1
        || map[this.getMapY()][this.getMapXRightSide()] == 1
        || map[this.getMapYRightSide()][this.getMapX()] == 1
        || map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true;
        }
        return false;
    }
    changeDirectionIfPossible() {       
        let tempDirection = this.direction;
        let destX = parseInt(this.target.x / oneBlockSize);
        let destY = parseInt(this.target.y / oneBlockSize);
        this.direction = this.calculateNewDirection(map, destX, destY);
        if(typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }
        this.moveForwards();
        if(this.checkCollision()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for(let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }
        let queue = [{
            x: this.getMapX(),
            y: this.getMapY(),
            moves: [],
        }];
        while(queue.length > 0) {
            let popped = queue.shift();
            if(popped.x == destX && popped.y == destY) {
                return popped.moves[0];
            } else {
                mp[popped.y][popped.x] = 1;
                let neighborList = this.addNeighbors(popped, mp);
                for(let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }
        return DIRECTION_UP;
    }

    addNeighbors(popped, mp) {
        let queue = [];
        if(popped.x - 1 >= 0 && popped.x - 1 <  mp.length && 
            mp[popped.y][popped.x - 1] != 1) {
                let tempMoves = popped.moves.slice();
                tempMoves.push(DIRECTION_LEFT);
                queue.push({x: popped.x - 1, y: popped.y, moves: tempMoves});
        }
        if(popped.x + 1 >= 0 && popped.x + 1 <  mp.length && 
            mp[popped.y][popped.x + 1] != 1) {
                let tempMoves = popped.moves.slice();
                tempMoves.push(DIRECTION_RIGHT);
                queue.push({x: popped.x + 1, y: popped.y, moves: tempMoves});
        }
        if(popped.y - 1 >= 0 && popped.y - 1 <  mp.length && 
            mp[popped.y - 1][popped.x] != 1) {
                let tempMoves = popped.moves.slice();
                tempMoves.push(DIRECTION_UP);
                queue.push({x: popped.x, y: popped.y - 1, moves: tempMoves});
        }
        if(popped.y + 1 >= 0 && popped.y + 1 <  mp.length && 
            mp[popped.y + 1][popped.x] != 1) {
                let tempMoves = popped.moves.slice();
                tempMoves.push(DIRECTION_DOWN);
                queue.push({x: popped.x, y: popped.y + 1, moves: tempMoves});
        }
        return queue;
    }

    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height,
        );
        canvasContext.restore();
    }
    getMapX() {
        return parseInt(this.x / oneBlockSize);
    }
    getMapY() {
        return parseInt(this.y / oneBlockSize);
    }
    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * oneBlockSize) / oneBlockSize);
    }
    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * oneBlockSize) / oneBlockSize);
    }

}