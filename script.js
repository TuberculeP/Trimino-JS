const c = document.querySelector("canvas");
const ctx = c.getContext("2d");
let coord = [0, 0];
let reccurence = 3;
let count = 0;
const ANGLE = 90 * Math.PI/180;
let rotation = 0;


function rotate(n){
    let temp;
    n = n%4;
    for(let i=0; i<n;i++){
        ctx.rotate(ANGLE)
        temp = coord[0];
        coord[0] = coord[1];
        coord[1] = - temp;
        rotation = (rotation+1)%4;
    }
}

function reset(){
    count = 0;
    document.querySelector('input').value = reccurence;
    ctx.resetTransform()
    ctx.restore()
    ctx.clearRect(0, 0, c.width, c.height);
    coord = [0, 0];
    problemeFinal(reccurence)
}

function randint(max) {
    return Math.floor(Math.random() * max);
}

function randcolor() {
    return 'rgb('
        +(40+randint(215))+','
        +(40+randint(215))+','+
        +(40+randint(215))+')';
}

function creeTrou(n){
    return [randint((2**n)),randint((2**n))];
}

function dessineProbleme(n,a,trou = null){

    if(trou === null) trou = creeTrou(n);

    ctx.beginPath()
    ctx.rect(trou[0]*a, trou[1]*a, a, a);
    ctx.fillStyle = 'black';
    ctx.fill()
    coord[0] = trou[0]*a;
    coord[1] = trou[1]*a + a;
}



function dessineTrimino(n){
    count++;
    ctx.beginPath();
    //gauche -> droite
        ctx.lineTo(coord[0]+n, coord[1]);
        coord[0] += n;
    //droite -> bas
        ctx.lineTo(coord[0], coord[1]+n);
        coord[1] += n;
    //bas ---grand--> gauche
        ctx.lineTo(coord[0]-n*2, coord[1]);
        coord[0] -= n*2;
    //gauche ---grand--> haut
        ctx.lineTo(coord[0], coord[1]-n*2);
        coord[1] -= n*2;
    //haut -> droite
        ctx.lineTo(coord[0]+n, coord[1]);
        coord[0] += n;
    //droite -> bas
    ctx.lineTo(coord[0], coord[1]+n);
    coord[1] += n;
    ctx.closePath();
    ctx.fillStyle = randcolor();
    ctx.strokeStyle = 'black'
    ctx.stroke();
    ctx.fill();
}

function dessineComplexe(a,ordre){
    if(ordre == 1){
        dessineTrimino(a)
    }else if(ordre > 1){
        //le premier est dessiné
        dessineComplexe(a, ordre-1)
        coord[0] -=(a*2**(ordre-2));
        coord[1] +=(a*2**(ordre-2));
        dessineComplexe(a, ordre-1)
        coord[1] -= 2*(a*2**(ordre-2));
        rotate(1);
        dessineComplexe(a, ordre-1)
        coord[0] += 2*(a*2**(ordre-2));
        coord[1] -= 2*(a*2**(ordre-2));
        rotate(2);
        dessineComplexe(a, ordre-1)
        coord[0] +=(a*2**(ordre-2));
        coord[1] -=(a*2**(ordre-2));
        rotate(1);


    }
}

function solutionProbleme(n,a,taillebase){

    let x = (coord[0]/a)%2;
    let y = (coord[1]/a)%2;
    if(x===1 && y===0){
        coord[1] -= a;
        rotate(1);
    }else if(x===0 && y===0){
        coord[1] -= a;
        coord[0] += a;
        rotate(2);
    }else if(x===0 && y===1){
        coord[0] += a;
        rotate(3);
    }

    dessineComplexe(taillebase, Math.log2(a/taillebase)+1);

    rotate(4 - rotation);
    coord[0] -=a;
    coord[1] +=a;

    if((n-1)!==0){
        solutionProbleme(n-1, a*2, taillebase);
    }
}

function problemeFinal(n,a=null, trou=null){
    if(a === null) a = Math.floor(c.width/(2**n));
    dessineProbleme(n, a, trou)
    if(n > 0){solutionProbleme(n,a,a);}
}

document.querySelector('input')
    .addEventListener('change', ()=>{
        reccurence = document.querySelector('input').value;
        reset();
    })

reset();
