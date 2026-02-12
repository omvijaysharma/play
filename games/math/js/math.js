function wrong(value) {
    let wrongAns;
    do {
        wrongAns = Math.random() * (value * 2);
        if (Number.isInteger(value)) {
            wrongAns = Math.floor(wrongAns);
        } else {
            wrongAns = parseFloat(wrongAns.toFixed(3));
        }
    } while (wrongAns === value);
    return withORwithoutPoint(wrongAns);
}

let ops = ['+', '-', '*', '/'];

function TWOtruefalse() {
    let a = getnum(), 
        b = getnum();
        
    let op = ops[randomNo(0, 3)];
    let index = randomNo(0, 1);

    let correctAnswer = new Function('a', 'b', `return a ${op} b;`)(a, b);
    let falseAnswer = wrong(correctAnswer);
    

    let structure = [
        `${a} ${op} ${b} = ${falseAnswer}`,
        `${a} ${op} ${b} = ${withORwithoutPoint(correctAnswer)}`
    ];
    
    let answer = index === 1 ? 'true' : 'false';

    FOGet('#questionDisplay').innerHTML = structure[index];
    FOGet('#answerP').innerText = answer;
    
    FOindexbutton(1).innerText = 'true';
    FOindexbutton(2).innerText = 'false';
    FOindexbutton(1).style.display = 'block'
    FOindexbutton(2).style.display = 'block'
    FOindexbutton(3).style.display = 'none'
    FOindexbutton(4).style.display = 'none'
}

function power() {
    let num = getnum();
    let answer = num * num
    
    FOGet('#questionDisplay').innerHTML = `${num}²`;
    FOGet('#answerP').innerText = answer
    setoption(answer,4);
}

// 2 Digit Question
function TWOdigit() {  
    let a = getnum(),
        b = getnum()
        
    let op = ops[randomNo(0, 3)]
    let answer = `${withORwithoutPoint(eval(`${a} ${op} ${b}`))}`;

    FOGet('#questionDisplay').innerHTML = `${a} ${op} ${b}`;
    FOGet('#answerP').innerText = answer
    setoption(answer,4);
}

// 3 Digit Question
function THREEdigit() {  
    let a = getnum(),
        b = getnum(),
        c = getnum()
        
    let op1 = ops[randomNo(0, 3)], op2 = ops[randomNo(0, 3)];
    
    let patterns = [
        `(${a} ${op1} ${b}) ${op2} ${c}`,
        `${a} ${op1} (${b} ${op2} ${c})`
    ];
    
    let expression = patterns[randomNo(0, 1)];
    let answer = eval(expression);

    FOGet('#questionDisplay').innerHTML = `${expression}`;
    FOGet('#answerP').innerText = parseFloat(answer.toFixed(3));
    setoption(answer,4);
}

function FINDtwoDIGIT() {  
    let a = getnum(),
        b = getnum()
        
    let op = ops[randomNo(0, 3)];
    let index = randomNo(0, 1)
    
    let expressions = [
        `${a} ${op} ? <br><br> = ${withORwithoutPoint(eval(`${a} ${op} ${b}`))}`,
        `? ${op} ${b} <br><br> = ${withORwithoutPoint(eval(`${a} ${op} ${b}`))}`
    ];
    
    let answer;
    
         if (index === 0) {answer = b}
    else                  {answer = a}
    
    FOGet('#questionDisplay').innerHTML = expressions[index];
    FOGet('#answerP').innerText = answer;
    setoption(answer,4);
}
function FINDthreeDIGIT() {  
    let a = getnum(),
        b = getnum(),
        c = getnum()
        
    let op1 = ops[randomNo(0, 3)], op2 = ops[randomNo(0, 3)];
    let index = randomNo(0, 5)

    let expressions = [
        `(${a} ${op1} ${b}) ${op2} ? <br><br> = ${withORwithoutPoint(eval(`(${a} ${op1} ${b}) ${op2} ${c}`))}`,
        `(${a} ${op1} ?) ${op2} ${c} <br><br> = ${withORwithoutPoint(eval(`(${a} ${op1} ${b}) ${op2} ${c}`))}`,
        `(? ${op1} ${b}) ${op2} ${c} <br><br> = ${withORwithoutPoint(eval(`(${a} ${op1} ${b}) ${op2} ${c}`))}`,
        `${a} ${op1} (${b} ${op2} ?) <br><br> = ${withORwithoutPoint(eval(`${a} ${op1} (${b} ${op2} ${c})`))}`,
        `${a} ${op1} (? ${op2} ${c}) <br><br> = ${withORwithoutPoint(eval(`${a} ${op1} (${b} ${op2} ${c})`))}`,
        `? ${op1} (${b} ${op2} ${c}) <br><br> = ${withORwithoutPoint(eval(`${a} ${op1} (${b} ${op2} ${c})`))}`
    ];

    let answer; 
    
         if (index === 0 || index === 3) {answer = c}
    else if (index === 1 || index === 4) {answer = b}
    else                                 {answer = a}

    FOGet('#questionDisplay').innerHTML = expressions[index]; 
    FOGet('#answerP').innerText = answer;
    setoption(answer,4);
}
// 2 ya 3 question choose karna  
function question() {
    let num = Math.random() * 100;

    let one =          25
    let two = one +    35
    let three = two +  20
    let four = three + 15
    let five = four +   5
    let six = five +   10
    
         if (num < one)   {TWOtruefalse();}
    else if (num < two)   {power();}
    else if (num < three) {THREEdigit();}
    else if (num < four)  {FINDtwoDIGIT();}
    else if (num< five)   {FINDthreeDIGIT();}
    else if (num< six)    {FINDthreeDIGIT();}
    else                  {TWOtruefalse();}
}

// options verify
function useroption(option) {
    let answer = FOGet('#answerP').innerText
    let text = FOindexbutton(option);

    function commentANDtextANDsound(color,word,soundEle) {
        text.style.color = text.style.borderColor = color;
        FOGet('#comment').innerText = word;
        FOGet('#comment').style.color = color;
        if (soundEle) {
            FOGet(soundEle).volume = (getData("SOUND") / 100)
            FOGet(soundEle).play();
        }
    }

    if (text.innerText = answer) {
    // User ne sahi jawab diya
        commentANDtextANDsound('#3bff00','right','#point-sound')
        FOGet('.bottom-div').style.pointerEvents = 'none'
        setTimeout(function() {
            game('next');
            FOGet('.bottom-div').style.pointerEvents = 'auto';
            saveData("LEVEL", parseInt(FOGet('#level').innerText) + 1);
            FOGet('#level').innerText = getData("LEVEL");
    }, 1500);
    } else {
        // User ne galat jawab diya
        commentANDtextANDsound('red','wrong','#wrong-sound')
    }

    // Default reset
    setTimeout(() => commentANDtextANDsound('#fff',' '), 500);
}  

function setoption(ans,options) {
    let index = Math.floor(Math.random() * options) + 1;
    
    for (let i = 1; i < options + 1; i++) {
        FOindexbutton(i).style.display = 'block'
             if (i === index) {FOindexbutton(i).innerText = withORwithoutPoint(ans);}
        else                  {FOindexbutton(i).innerText = wrong(ans);}
    }
}

// Game ko shuru karne ka function  
function game(text) {  
    loading(text);  
    question();
}  

game('loading');