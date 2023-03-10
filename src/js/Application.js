import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";
export default class Application extends EventEmitter {
  static get events() {
    return {
      READY: "ready",
    };
  }

  constructor() {
    super();

    this.planets = "";

    this._loading = document.querySelector('.progress');

    this._load().then(() => this.emit(Application.events.READY));
  }

  async _load() {
    const URL = 'https://swapi.boom.dev/api/planets/';
    let next = URL;

    this._startLoading();

    while (next) {
      const response = await fetch(next);

      const planetCollection = await response.json();
      next = planetCollection.next;

      this.planets = [...this.planets, ...planetCollection.results];
    }

    this._create();

    this._stopLoading();
  }

  _create() {
    this.planets.forEach(planet => {
      const box = document.createElement('div');
      box.classList.add('box');

      box.innerHTML = this._render({
        name: planet.name,
      });

      document.body.querySelector(".main").appendChild(box);
    })
  }

  _startLoading() {
    this._loading.style.display = 'block';
  }

  _stopLoading() {
    this._loading.style.display = 'none';
  }

  _render({name }) {
    return `
  <div>
    <h4 class=mb-2>${name}</h4>
      <div class="image is-64x64">
        <img src="${image}">
    </div>
  </div>
    `;
  }
}