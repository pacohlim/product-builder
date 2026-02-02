
class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.setAttribute('class', 'lotto-container');

    const title = document.createElement('h1');
    title.textContent = 'Lotto Number Generator';

    const display = document.createElement('div');
    display.setAttribute('class', 'number-display');

    const button = document.createElement('button');
    button.textContent = 'Generate Numbers';

    const style = document.createElement('style');
    style.textContent = `
      :host {
        --color-primary: #6a11cb;
        --color-secondary: #2575fc;
        --color-accent: #ff55a5;
        --color-text: #ffffff;
      }

      .lotto-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      h1 {
        font-size: 2.8rem;
        font-weight: 700;
        margin: 0;
        margin-bottom: 1rem;
        text-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3);
      }

      .number-display {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        margin: 2rem 0;
        perspective: 800px;
      }

      .number-ball {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 2rem;
        font-weight: 600;
        color: var(--color-text);
        box-shadow: 0 10px 20px rgba(0,0,0,0.3), inset 0 -5px 10px rgba(0,0,0,0.4);
        transform-style: preserve-3d;
        transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.5s ease;
        transform: rotateY(-180deg) scale(0.5);
      }

      button {
        font-family: inherit;
        font-size: 1.5rem;
        font-weight: 600;
        padding: 1rem 3rem;
        border: none;
        border-radius: 50px;
        cursor: pointer;
        color: var(--color-text);
        background: linear-gradient(135deg, var(--color-accent), var(--color-secondary));
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 0 20px var(--color-accent);
      }

      button:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3), 0 0 30px var(--color-accent);
      }

      button:active {
        transform: translateY(0) scale(1);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2), 0 0 20px var(--color-accent);
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(container);
    container.appendChild(title);
    container.appendChild(display);
    container.appendChild(button);

    button.addEventListener('click', () => this.generateNumbers(display));
    this.generateNumbers(display);
  }

  generateNumbers(display) {
    display.innerHTML = '';
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    sortedNumbers.forEach((number, index) => {
        const ball = document.createElement('div');
        ball.setAttribute('class', 'number-ball');
        ball.textContent = number;
        ball.style.backgroundColor = this.getColor(number);
        display.appendChild(ball);

        setTimeout(() => {
          ball.style.transform = 'rotateY(0deg) scale(1)';
        }, 100 * (index + 1));
    });
  }

  getColor(number) {
    const colors = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    return colors[Math.floor(number / 4)];
  }
}

customElements.define('lotto-generator', LottoGenerator);
