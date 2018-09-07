$(document).ready( function() {
  
  //  Represents the sequence of the game's tiles, game state, turn count, audio, and array representations of the color tiles
  let sequenceArr = [],
      gameOn = false,
      strictOn = false,
      turn = 0,
      gameTurn = 1,
      randomIndex = 0,
      i = 0,
      green = new Audio,
      red = new Audio,
      blue = new  Audio,
      yellow = new Audio,
      colorArr = ['#lt', '#rt', '#rb', '#lb'],
      audioArr = {'#lt': green,'#rt': red,'#rb': blue,'#lb': yellow },
      lightenArr = { '#lt': '#40bf40','#rt': '#ff0000',
                     '#rb': '#0080ff','#lb': '#ffff00' },
      darkenArr =  { '#lt': '#339933','#rt': '#cc0000', 
                     '#rb': '#0066cc','#lb': '#e6e600' };
  
  green.src = 'assets/green.mp3';  //  https://s3.amazonaws.com/freecodecamp/simonSound1.mp3
  red.src = 'assets/red.mp3';  //  https://s3.amazonaws.com/freecodecamp/simonSound2.mp3
  blue.src = 'assets/blue.mp3';  //  https://s3.amazonaws.com/freecodecamp/simonSound3.mp3
  yellow.src = 'assets/yellow.mp3';  //  https://s3.amazonaws.com/freecodecamp/simonSound4.mp3
  
  //  Sets sound attributes
  const setSound = (color) => {
    color.volume = 0.50;
    color.autoPlay = false;
    color.preLoad = true;
  }
  
  setSound(green);
  setSound(red);
  setSound(blue);
  setSound(yellow); 
  
  //  Resets game
  const resetGame = () => {
    window.setTimeout(() => {
      i = 0;
      turn = 0;
      gameTurn = 1;
      sequenceArr = [];
      firstMove();
    }, 1000)
  }
  
  //  Darkens new sequence tile
  const delayRandom = () => {
    $(colorArr[randomIndex]).css('background', darkenArr[colorArr[randomIndex]]);
  }
  
  //  Plays back sequence with a delay
  const delaySequence = () => {
     audioArr[sequenceArr[i]].play();
     $(sequenceArr[i]).css('background', lightenArr[sequenceArr[i]]);
  }
  
  //  Selects tile with delay
  const delayColor = () => {
    $(sequenceArr[i]).css('background', darkenArr[sequenceArr[i]]);
  }
  
  //  Starts off the game
  const firstMove = () => {
    randomIndex = [Math.floor((Math.random() * 3))];
    audioArr[colorArr[randomIndex]].play();
    $(colorArr[randomIndex]).css('background', lightenArr[colorArr[randomIndex]]);
    window.setTimeout(delayRandom, 1000);
    sequenceArr.push(colorArr[randomIndex]);
    $('#CounterScreen').text(gameTurn);
  }
  
  //  Adds a random tile to sequence
  const addMove = () => {
    gameTurn++;
    randomIndex = [Math.floor((Math.random() * 3))];
    sequenceArr.push(colorArr[randomIndex]);
    
    if (gameTurn == 21) {
      window.setTimeout(() => {
        $('#CounterScreen').text('Win');
        window.setTimeout(() => {
          resetGame();
        }, 500)
      }, 1000)
    } else {
      $('#CounterScreen').text(gameTurn);
    }
  }
  
  //  Plays out current sequence
  //  If sequence is surpassed, comp adds new seqence
  const compMove = () => {
    window.setTimeout(() => {
      delaySequence();
      
      if (i < sequenceArr.length) compMoveTwo();                        
   }, 750)
  }
  
  const compMoveTwo = () => {
    window.setTimeout(() => {
      delayColor();
      i++;
      
      if (i < sequenceArr.length) compMove();                        
   }, 750)
  }
  
  //  Turns the game on or off
  $('#StartBtn').on('click', function() {
    if (!gameOn) {
      gameOn = true;
      $('#CounterScreen').css('color','#ff0000');
      window.setTimeout(firstMove, 1000);
    }
  })
  
  //  Turns the strict mode of the game on or off
  //  Mistakes in strict mode reset the game
  $('#StrictBtn').on('click', function() {
    if (gameOn) {
      if (strictOn) {
        strictOn = false;
        $('#StrictLight').css('background','#800000');
      } else {
        strictOn = true;
        $('#StrictLight').css('background','#ff0000');
      }
    }
  })
  
  //  Resets the game
  $('#ResetBtn').on('click', function() {
    $('#CounterScreen').text('- -');
    resetGame();
  })
  
  //  Event handler that checks tile selected and cascades to game logic
  $('.colorBtn').on('mousedown', function() {
    if (gameOn) {
      audioArr[$(this).text()].play();
      $(this).css('background', lightenArr[$(this).text()]);
      
      if ($(this).text() == sequenceArr[turn]) {
        
        //  If the current tile is matched, the sequence progresses
        //  If the sequence is fully matched, a new tile is added to the sequence
        //  If the player beats the game in the 20th turn, the player wins and the game ends
        if (turn + 1 !== sequenceArr.length) {
          turn++;
        } else {
          addMove();
          if (gameTurn !== 21) {
            compMove();
            turn = 0;
            i = 0;
          }
        }
        //  Strict mode
      } else if (strictOn) {
        $('#CounterScreen').text('!');
        resetGame();
      } else {
        window.setTimeout(() => {
          $('#CounterScreen').text('!');
          i = 0;
          turn = 0;
          compMove();
          window.setTimeout(() => {
            $('#CounterScreen').text(gameTurn);
          }, 1500)
        }, 500)
      }
    }
  })
  
  //  Resets tile coloring after mousepress
  $('.colorBtn').on('mouseup', function() {
    $(this).css('background', darkenArr[$(this).text()]);
  })
})
