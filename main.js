
class DinnerRecommender extends HTMLElement {
  static get observedAttributes() {
    return ['theme'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const container = document.createElement('div');
    container.setAttribute('class', 'dinner-container');

    const title = document.createElement('h1');
    title.textContent = '오늘 저녁 뭐 먹지?';

    const display = document.createElement('div');
    display.setAttribute('class', 'menu-display');

    const button = document.createElement('button');
    button.textContent = '메뉴 추천!';

    const style = document.createElement('style');
    style.textContent = `
      :host {
        --color-primary-dark: #6a11cb;
        --color-secondary-dark: #2575fc;
        --color-accent-dark: #ff55a5;
        --color-text-dark: #ffffff;

        --color-primary-light: #f0f0f0;
        --color-secondary-light: #e0e0e0;
        --color-accent-light: #007bff;
        --color-text-light: #333333;

        --color-primary: var(--color-primary-dark);
        --color-secondary: var(--color-secondary-dark);
        --color-accent: var(--color-accent-dark);
        --color-text: var(--color-text-dark);
      }
      
      :host([theme="light"]) {
        --color-primary: var(--color-primary-light);
        --color-secondary: var(--color-secondary-light);
        --color-accent: var(--color-accent-light);
        --color-text: var(--color-text-light);
      }

      .dinner-container {
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
        color: var(--color-text);
      }
      
      :host([theme="light"]) h1 {
        text-shadow: none;
      }

      .menu-display {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1.5rem;
        margin: 2rem 0;
        min-height: 350px;
        width: 400px;
      }

      .menu-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform: scale(0);
      }

      .menu-image {
        width: 300px;
        height: 300px;
        border-radius: 20px;
        object-fit: cover;
        box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.2);
      }

      .menu-name {
        font-size: 2.5rem;
        font-weight: 600;
        color: var(--color-text);
        margin-top: 1.5rem;
        text-shadow: 0 2px 5px rgba(0,0,0,0.5);
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

    this.menus = [
      { name: "김치찌개", imageUrl: "https://source.unsplash.com/400x300/?kimchi-jjigae" },
      { name: "된장찌개", imageUrl: "https://source.unsplash.com/400x300/?doenjang-jjigae" },
      { name: "부대찌개", imageUrl: "https://source.unsplash.com/400x300/?budae-jjigae" },
      { name: "비빔밥", imageUrl: "https://source.unsplash.com/400x300/?bibimbap" },
      { name: "불고기", imageUrl: "https://source.unsplash.com/400x300/?bulgogi" },
      { name: "떡볶이", imageUrl: "https://source.unsplash.com/400x300/?tteokbokki" },
      { name: "순대", imageUrl: "https://source.unsplash.com/400x300/?sundae,korean+food" },
      { name: "라면", imageUrl: "https://source.unsplash.com/400x300/?ramen" },
      { name: "칼국수", imageUrl: "https://source.unsplash.com/400x300/?kalguksu" },
      { name: "수제비", imageUrl: "https://source.unsplash.com/400x300/?sujebi" },
      { name: "피자", imageUrl: "https://source.unsplash.com/400x300/?pizza" },
      { name: "햄버거", imageUrl: "https://source.unsplash.com/400x300/?hamburger" },
      { name: "파스타", imageUrl: "https://source.unsplash.com/400x300/?pasta" },
      { name: "스테이크", imageUrl: "https://source.unsplash.com/400x300/?steak" },
      { name: "초밥", imageUrl: "https://source.unsplash.com/400x300/?sushi" },
      { name: "돈까스", imageUrl: "https://source.unsplash.com/400x300/?tonkatsu" },
      { name: "우동", imageUrl: "https://source.unsplash.com/400x300/?udon" },
      { name: "쌀국수", imageUrl: "https://source.unsplash.com/400x300/?pho" },
      { name: "카레", imageUrl: "https://source.unsplash.com/400x300/?curry" },
      { name: "짜장면", imageUrl: "https://source.unsplash.com/400x300/?jjajangmyeon" }
    ];

    button.addEventListener('click', () => this.recommendMenu(display));
    this.recommendMenu(display);
  }

  recommendMenu(display) {
    display.innerHTML = '';
    const randomIndex = Math.floor(Math.random() * this.menus.length);
    const selectedMenu = this.menus[randomIndex];

    const menuItem = document.createElement('div');
    menuItem.setAttribute('class', 'menu-item');
    
    const menuImage = document.createElement('img');
    menuImage.setAttribute('class', 'menu-image');
    menuImage.src = selectedMenu.imageUrl;
    menuImage.alt = selectedMenu.name;

    const menuName = document.createElement('div');
    menuName.setAttribute('class', 'menu-name');
    menuName.textContent = selectedMenu.name;

    menuItem.appendChild(menuImage);
    menuItem.appendChild(menuName);
    display.appendChild(menuItem);

    setTimeout(() => {
      menuItem.style.transform = 'scale(1)';
    }, 100);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'theme') {
      // Theme application is handled by CSS :host([theme="light"])
    }
  }
}

customElements.define('dinner-recommender', DinnerRecommender);

const themeSwitcher = document.getElementById('theme-switcher');
themeSwitcher.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const dinnerRecommender = document.querySelector('dinner-recommender');
  if (document.body.classList.contains('light-mode')) {
    dinnerRecommender.setAttribute('theme', 'light');
  } else {
    dinnerRecommender.removeAttribute('theme');
  }
});
