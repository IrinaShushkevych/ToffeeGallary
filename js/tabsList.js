export default class TabsList {
  constructor() {
    this._list = document.querySelector('.tabsList')
    this._btn = this._list.querySelectorAll('.tabsList__button')
    this._item = this._list.querySelectorAll('.tabsList__item')
    this._submit = this._list.querySelector('.tabsList__submitButton')
    this._addEvents()
  }

  _addEvents() {
    this._btn.forEach((el) => {
      el.addEventListener('click', this._onBtnClick.bind(this))
    })
  }

  _onBtnClick(e) {
    this._btn.forEach((el) => {
      if (el.classList.contains('is-active')) el.classList.remove('is-active')
    })
    e.target.classList.add('is-active')
    this._activeForm(e.target.dataset.index)
  }

  _activeForm(idx) {
    this._item.forEach((el) => {
      if (el.classList.contains('is-active')) el.classList.remove('is-active')
      if (el.dataset.index === idx) el.classList.add('is-active')
    })
  }

  getResult() {
    const el = this._list.querySelectorAll('input')
    const result = { root: 'toffee' }
    el.forEach((el) => {
      if (el.type === 'checkbox') result[el.name] = el.checked
      if (el.type === 'text') {
        if (Number(el.value)) {
          result[el.name] = Number(el.value)
        } else {
          result[el.name] = el.value
        }
      }
    })
    return result
  }
}
