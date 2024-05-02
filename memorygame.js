document.addEventListener('DOMContentLoaded', function () {
    const evenColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown'];
    let gameStarted = false;
    let score = 0;
    let highestScore = localStorage.getItem('highestScore') || 0;

    const gameBoard = document.getElementById('gameBoard');
    let flippedCards = [];
    let isFlipping = false;
    let clickEnabled = false;

    function createCard(color) {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.color = color;

      const front = document.createElement('div');
      front.classList.add('front');
      
      card.appendChild(front);
      card.addEventListener('click', flipCard);

      return card;
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function initializeGame() {
      score = 0;
      document.getElementById('score').textContent = `Score: ${score}`;
      flippedCards = [];
      isFlipping = false;
      clickEnabled = true;

      gameBoard.innerHTML = '';
      shuffleArray(evenColors);

      // Create pairs of cards
      const cardColors = [...evenColors, ...evenColors];
      shuffleArray(cardColors);

      cardColors.forEach(color => {
        const card = createCard(color);
        gameBoard.appendChild(card);
      });
    }

    function flipCard() {
      if (!clickEnabled || isFlipping || flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('match')) {
        return;
      }

      this.classList.add('flipped');
      this.querySelector('.front').style.backgroundColor = this.dataset.color;
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        isFlipping = true;
        clickEnabled = false;
        setTimeout(checkMatch, 1000);
      }
    }

    function checkMatch() {
      const [card1, card2] = flippedCards;

      if (card1.dataset.color === card2.dataset.color && card1 !== card2) {
        // Matched
        card1.classList.add('match');
        card2.classList.add('match');
        score += 2; // Increase score for a match
        document.getElementById('score').textContent = `Score: ${score}`;
      } else {
        // Not matched, flip back to black
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.querySelector('.front').style.backgroundColor = '#000';
        card2.querySelector('.front').style.backgroundColor = '#000';
      }

      flippedCards = [];
      isFlipping = false;
      clickEnabled = true;

      // Check if the game has ended
      if (document.querySelectorAll('.match').length === evenColors.length * 2) {
        alert(`Congratulations! You won! Your Score: ${score}`);
        if (score > highestScore) {
          highestScore = score;
          localStorage.setItem('highestScore', highestScore);
          alert(`New Highest Score: ${highestScore}`);
        }
        document.getElementById('restartBtn').disabled = false;
      }
    }

    window.startGame = function () {
      if (!gameStarted) {
        initializeGame();
        gameStarted = true;
        document.getElementById('startBtn').disabled = true;
        document.getElementById('restartBtn').disabled = false;
      }
    }

    window.restartGame = function () {
      gameStarted = false;
      document.getElementById('startBtn').disabled = false;
      document.getElementById('restartBtn').disabled = true;
      initializeGame();
    }
  });