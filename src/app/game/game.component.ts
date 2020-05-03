import { Component, OnInit, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {
  showBoard = false;
  height: any;
  width: any;
  hero: any;
  villan: any;
  totalCount = 0;
  xCord = 0;
  yCord = 0;
  enemyCord = [];
  isInitialized = false;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D;
  then = 0;
  constructor() { }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    let th = 400 / this.height;
    let tw = 400 / this.width;
    this.ctx.clearRect(this.xCord * tw - tw, this.yCord * th - th, tw, th)
    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.totalCount += 1;
      this.xCord += 1;
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.totalCount += 1;
      this.xCord -= 1;
    }

    if (event.keyCode === KEY_CODE.UP_ARROW) {
      this.totalCount += 1;
      this.yCord -= 1;
    }

    if (event.keyCode === KEY_CODE.DOWN_ARROW) {
      this.totalCount += 1;
      this.yCord += 1;
    }


    for (let k = 0; k < this.enemyCord.length; k++) {

      if (this.enemyCord[k].x == this.xCord && this.enemyCord[k].y == this.yCord) {
        if (k > -1) {
          this.enemyCord.splice(k, 1);
          k--;
        }
      }
    }
    if (this.isInitialized != false) {
      if (this.enemyCord.length == 0) {
        window.alert(`You have won the game. Total no of moves ${this.totalCount}`);
        this.ctx.clearRect(0, 0, 400, 400);
        this.isInitialized = false;
        this.showBoard = false;
      }
    }
    if ((this.xCord > this.width || this.xCord < 1) || (this.yCord > this.height || this.yCord < 1)) {
      if (this.xCord == 0) {
        this.xCord += 1;
      }
      if (this.yCord == 0) {
        this.yCord += 1;
      }
      if (this.xCord == this.width + 1) {
        this.xCord -= 1;
      }
      if (this.yCord == this.height + 1) {
        this.yCord -= 1;
      }
      this.totalCount -= 1;
    }
    if (this.isInitialized != false) {
      this.MoveCharacter();
    }
  }

  ngOnInit() { }

  MoveCharacter() {
    const tw = 400 / this.width;
    const th = 400 / this.height;

    this.ctx.drawImage(this.hero, this.xCord * tw - tw, this.yCord * th - th, tw, th);
    requestAnimationFrame(this.MoveCharacter);
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.height = prompt('Please enter board height');
    this.width = prompt('Please enter board width');
    // tslint:disable-next-line: radix
    if (isNaN(parseInt(this.height)) && isNaN(parseInt(this.height))) {
       alert('Height and width should be numeric only');
       return;
    }
    this.showBoard = true;
    this.createGrid(this.height, this.width);
    this.totalCount = 0;
  }


  createGrid(boardHeigth: number, boardWidth: number) {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.beginPath();
    for (let x = 0.5; x < 400; x += Math.round(400 / boardWidth)) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, 400);
    }

    for (let y = 0.5; y < 400; y += Math.round(400 / boardHeigth)) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(400, y);
    }

    this.ctx.strokeStyle = 'grey';
    this.ctx.stroke();
    this.ctx.closePath();
    this.addCharacters(400 / boardHeigth, 400 / boardWidth, boardHeigth, boardWidth);
    this.addEnemy(400 / boardHeigth, 400 / boardWidth, boardHeigth, boardWidth);
  }

  addCharacters(th, tw, h, w) {
    this.xCord = Math.ceil(w / 2);
    this.yCord = Math.ceil(h / 2);
    this.hero = new Image();
    this.hero.src = 'assets/mario.jpeg';
    this.hero.onload = () => {
      this.ctx.drawImage(this.hero, this.xCord * tw - tw, this.yCord * th - th, tw, th);
    }
  }

  addEnemy(th, tw, h, w) {
    this.enemyCord = [];
    let array_length;
    if (h > w) {
      array_length = w;
    } else {
      array_length = h
    }
    let xCord = Math.ceil(w / 2);
    let yCord = Math.ceil(h / 2);
    for (let i = 0; i < array_length; i++) {
      let Xcord = Math.ceil(Math.random() * w);
      let Ycord = Math.ceil(Math.random() * h);
      if (Xcord != xCord || Ycord != yCord) {
        this.enemyCord.push({ x: Xcord, y: Ycord });
        const img = new Image();
        img.src = 'assets/enemy.jpeg';
        img.onload = () => {
          this.ctx.drawImage(img, Xcord * tw - tw, Ycord * th - th, tw, th);
        }
      }
    }
    this.enemyCord = [...new Set(this.enemyCord)];
    this.isInitialized = true;
  }


  hideBoard() {
    this.showBoard = false;
    this.ctx.clearRect(0, 0, 400, 400);
  }
}
