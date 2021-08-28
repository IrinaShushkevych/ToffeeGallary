export default class ToffeeGalarry {
  constructor({
    typeContainer = 'ul',
    countItem = 4,
    activeItem = 2,
    spaceBetweenItem = 30,
    buttons = true,
    isPagination = true,
    isShowBigest = true,
    isShowBigestImg = true,
    isShowBigestButton = true,
    isLoop = true,
    ...settings
  }) {
    this._refs = {}
    this._events = {}
    this._refs.root = document.querySelector(`#${settings.root}`)
    this._typeContainer = typeContainer.toUpperCase()
    this._countItem = countItem
    this._activeItem = activeItem - 1
    this._orderActiveItem = activeItem - 1
    this._marginItem = spaceBetweenItem
    this._isLoop = isLoop
    this._isPagination = isPagination
    this._isShowBigest = isShowBigest
    this._isShowBigestImg = isShowBigestImg
    this._isShowBigestButton = isShowBigestButton
    this._isPagination = isPagination
    if (buttons) {
      this._refs.buttonLeft = document.querySelector('.toffee__button-left')
      this._refs.buttonRight = document.querySelector('.toffee__button-right')
    }

    this._refs.gallaryContainer = document.querySelector('.toffee__gallery')
    this._refs.items = this._refs.root.querySelectorAll(
      `.toffee__gallery .toffee__item`,
    )

    this._stylingContainer()
    this._stylingItem()
    this._stylingButton()
    if (this._isPagination) {
      this._setPagination()
      this._selectActivePagination()
    }
    if (this._isShowBigest) {
      this._setBackdrop()
      this._stylingBackdrop()
    }
    this._addEvents()
  }

  delete() {
    this._refs.items.forEach((el) => {
      el.removeEventListener('mouseenter', this._events.mouseenterItem)
      el.removeEventListener('mouseleave', this._events.mouseleaveItem)
      el.removeEventListener('click', this._events.clickItemEvent)
    })
    this._refs.buttonLeft.removeEventListener(
      'click',
      this._events.clickButtonLeft,
    )
    this._refs.buttonRight.removeEventListener(
      'click',
      this._events.clickButtonRight,
    )
    if (this._refs.backdrop) this._refs.root.removeChild(this._refs.backdrop)
    if (this._isPagination) {
      this._refs.root.removeChild(this._refs.pagination)
      this._refs.pagination.removeEventListener(
        'click',
        this._events.onClickPaginationButton,
      )
      delete this._events.onClickPaginationButton
    }
  }

  _addEvents() {
    this._events.clickItemEvent = this._onClickItem.bind(this)
    this._events.clickButtonLeft = this._onPrevItem.bind(this)
    this._events.clickButtonRight = this._onNextItem.bind(this)
    this._events.mouseenterItem = this._onFocusItem.bind(this)
    this._events.mouseleaveItem = this._onBlurItem.bind(this)
    this._refs.items.forEach((el) => {
      el.addEventListener('mouseenter', this._events.mouseenterItem)
      el.addEventListener('mouseleave', this._events.mouseleaveItem)
      el.addEventListener('click', this._events.clickItemEvent)
    })
    this._refs.buttonLeft.addEventListener(
      'click',
      this._events.clickButtonLeft,
    )
    this._refs.buttonRight.addEventListener(
      'click',
      this._events.clickButtonRight,
    )
    if (this._isPagination) {
      this._events.onClickPaginationButton = this._onClickPagination.bind(this)
      this._refs.pagination.addEventListener(
        'click',
        this._events.onClickPaginationButton,
      )
    }
  }

  _stylingContainer() {
    if (this._typeContainer === 'UL') {
      this._refs.gallaryContainer.style.listStyle = 'none'
      this._refs.gallaryContainer.style.display = 'flex'
      this._refs.gallaryContainer.style.flexWrap = 'wrap'
      this._refs.gallaryContainer.style.padding = '0'
      this._refs.root.style.position = 'relative'
    }
  }

  _stylingItem() {
    let cntBegin =
      this._countItem % 2 === 0
        ? this._activeItem - (Math.floor(this._countItem / 2) - 1)
        : this._activeItem - Math.floor(this._countItem / 2)
    let cntEnd =
      this._countItem % 2 === 0
        ? this._activeItem + Math.floor(this._countItem / 2)
        : this._activeItem + Math.floor(this._countItem / 2)
    let begin = -1
    let end = -1
    console.log('---------------------')
    console.log('begin', cntBegin)
    console.log('end', cntEnd)
    console.log('active ', this._activeItem)

    if (cntBegin <= 0 && !this._isLoop)
      this._refs.buttonLeft.style.visibility = 'hidden'
    if (cntBegin > 0 && !this._isLoop)
      this._refs.buttonLeft.style.visibility = 'visible'
    if (cntEnd >= this._refs.items.length - 1 && !this._isLoop)
      this._refs.buttonRight.style.visibility = 'hidden'
    if (cntEnd < this._refs.items.length - 1 && !this._isLoop)
      this._refs.buttonRight.style.visibility = 'visible'

    if (cntBegin < 0) {
      if (!this._isLoop) {
        cntEnd += 0 - cntBegin
        cntBegin = 0
      } else {
        begin = this._refs.items.length + cntBegin
        end = this._refs.items.length - 1
      }
    }

    if (cntEnd >= this._refs.items.length) {
      if (!this._isLoop) {
        cntBegin -= cntEnd - this._refs.items.length + 1
        cntEnd = this._refs.items.length - 1
      } else {
        begin = 0
        end = cntEnd - this._refs.items.length
      }
    }

    console.log('cnt begin', cntBegin)
    console.log('cnt end', cntEnd)
    console.log('begin', begin)
    console.log(' end', end)

    this._refs.items.forEach((el, idx) => {
      el.style.boxShadow =
        '0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)'
      el.style.width = `calc((100% - ${this._countItem - 1} * ${
        this._marginItem
      }px) / ${this._countItem})`
      el.style.transition = 'transform 250ms linear'
      if (
        (idx >= cntBegin && idx < cntEnd) ||
        (idx >= begin &&
          ((idx < end && end < this._refs.items.length - 1) ||
            (idx <= end && end === this._refs.items.length - 1)))
      ) {
        el.style.marginRight = `${this._marginItem}px`
      } else {
        el.style.marginRight = `0`
      }

      if ((idx >= cntBegin && idx <= cntEnd) || (idx >= begin && idx <= end)) {
        el.style.display = 'block'
      } else {
        el.style.display = 'none'
      }
      if (idx === this._activeItem) {
        el.style.transform = 'scale(1.1)'
      } else {
        el.style.transform = 'scale(1)'
      }

      if (begin === -1) {
        // el.style.order = idx - this._activeItem + 1
        el.style.order = this._countItem - 1 - (cntEnd - idx)
      } else if (begin === 0) {
        if (idx >= cntBegin && idx <= cntEnd)
          el.style.order =
            this._countItem - end - 1 - (this._refs.items.length - 1 - cntBegin)
        //   el.style.order = this._refs.items.length - 1 - idx
        //   el.style.order = idx - this._activeItem + 1
        if (idx >= begin && idx <= end)
          el.style.order = this._refs.items.length - cntBegin + 1 + idx
        //   el.style.order = this._refs.items.length - cntBegin + idx
        //   el.style.order = this._refs.items.length - this._activeItem + idx + 1
      } else if (end === this._refs.items.length - 1) {
        if (idx >= cntBegin && idx <= cntEnd)
          el.style.order = end - begin + 1 + idx
        //   el.style.order = idx - this._activeItem + 1
        if (idx >= begin && idx <= end) el.style.order = idx - begin
        //   el.style.order = this._refs.items.length - this._activeItem - idx - 1
      }
    })
  }

  _onClickItem(e) {
    this._activeItem = [...this._refs.items].indexOf(e.currentTarget)
    this._stylingItem()
    if (this._isShowBigest) {
      this._showBackdrop(e)
    }
  }

  _styleButtonElement(elem) {
    elem.style.position = 'absolute'
    elem.style.zIndex = 1000
    elem.style.top = '50%'
    elem.style.transform = 'translateY(-50%)'
    elem.style.width = '80px'
    elem.style.height = '40px'
    elem.style.border = 'none'
    elem.style.backgroundColor = 'transparent'
    elem.style.color = '#ffffff'
    elem.style.fontSize = '58px'
    elem.style.fontWeight = '700'
  }

  _stylingButton() {
    this._styleButtonElement(this._refs.buttonLeft)
    this._styleButtonElement(this._refs.buttonRight)
    this._refs.buttonLeft.style.left = '20px'
    this._refs.buttonRight.style.right = '20px'
  }

  _onFocusItem(e) {
    e.target.style.transform = 'scale(1.1)'
    e.target.style.zIndex = '999'
  }

  _onBlurItem(e) {
    e.target.style.transform = 'scale(1)'
    e.target.style.zIndex = '0'
  }

  _onPrevItem(e) {
    if (this._activeItem === 0) {
      this._activeItem = this._refs.items.length - 1
    } else {
      this._activeItem -= 1
    }
    this._stylingItem()
    if (this._isPagination) this._selectActivePagination()
  }

  _onNextItem(e) {
    if (this._activeItem === this._refs.items.length - 1) {
      this._activeItem = 0
    } else {
      this._activeItem += 1
    }
    this._stylingItem()
    if (this._isPagination) this._selectActivePagination()
  }

  _setBackdrop() {
    this._refs.backdrop = document.createElement('div')
    this._refs.backdrop.classList.add('toffee__backdrop')
    this._refs.backdrop.innerHTML = `<div class="toffee__overlay"></div>
        ${
          this._isShowBigestButton
            ? `<button type="button"
          class="toffee__backdropArrowPrev"
          data-type="prev"
        >
          <
        </button>
        <button
          type="button"
          class="toffee__backdropArrowNext"
          data-type="next"
        >
          >
        </button>`
            : ``
        }
        <div class="toffee__content"></div>
        <button
          type="button"
          class="toffee__buttonClose"
          data-action="close-backdrop"
        >X</button>
      </div>`
    this._refs.root.append(this._refs.backdrop)
    this._refs.overlay = this._refs.backdrop.querySelector('.toffee__overlay')
    this._refs.backdropCloseButton = this._refs.backdrop.querySelector(
      '.toffee__buttonClose',
    )
    if (this._isShowBigestButton) {
      this._refs.backdropNextItemButton = this._refs.backdrop.querySelector(
        '.toffee__backdropArrowNext',
      )
      this._refs.backdropPrevItemButton = this._refs.backdrop.querySelector(
        '.toffee__backdropArrowPrev',
      )
    }
    this._hideBackdrop()
  }

  _removeBackdrop() {
    this._refs.root.removeChild(this._refs.backdrop)
  }

  _stylingBackdrop() {
    this._refs.backdrop.style.display = 'flex'
    this._refs.backdrop.style.alignItems = 'center'
    this._refs.backdrop.style.justifyContent = 'center'
    this._refs.backdrop.style.position = 'fixed'
    this._refs.backdrop.style.zIndex = 1001
    this._refs.backdrop.style.top = 0
    this._refs.backdrop.style.left = 0
    this._refs.backdrop.style.width = '100vw'
    this._refs.backdrop.style.height = '100vh'
    this._refs.backdrop.style.transition = 'opacity 250ms linear'
    this._refs.overlay.style.position = 'absolute'
    this._refs.overlay.style.top = 0
    this._refs.overlay.style.left = 0
    this._refs.overlay.style.width = '100vw'
    this._refs.overlay.style.height = '100vh'
    this._refs.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    this._refs.backdropCloseButton.style.position = 'absolute'
    this._refs.backdropCloseButton.style.top = '8px'
    this._refs.backdropCloseButton.style.right = '8px'
    this._refs.backdropCloseButton.style.width = '48px'
    this._refs.backdropCloseButton.style.height = '48px'
    this._refs.backdropCloseButton.style.fontSize = '38px'
    this._refs.backdropCloseButton.style.border = 'none'
    this._refs.backdropCloseButton.style.borderRadius = '50%'
    this._refs.backdropCloseButton.style.color = '#fff'
    this._refs.backdropCloseButton.style.backgroundColor = 'transparent'
    this._refs.backdropCloseButton.style.cursor = 'pointer'
    this._refs.backdropCloseButton.style.outline = 'none'
    this._refs.backdropCloseButton.style.zIndex = 1003
    if (this._isShowBigestButton) {
      this._styleButtonElement(this._refs.backdropNextItemButton)
      this._styleButtonElement(this._refs.backdropPrevItemButton)
      this._refs.backdropPrevItemButton.style.left = '20px'
      this._refs.backdropNextItemButton.style.right = '20px'
      this._refs.backdropPrevItemButton.style.zIndex = 1003
      this._refs.backdropNextItemButton.style.zIndex = 1003
    }
  }

  _showBackdrop(e) {
    this._refs.backdrop.style.opacity = 1
    this._refs.backdrop.style.pointerEvents = 'initial'
    this._createBackdropElement(e.currentTarget)
    this._refs.overlay.addEventListener(
      'click',
      this._onClickOverlay.bind(this),
    )
    this._events.backdropCloseButtonClickEvent = this._onBackdropClose.bind(
      this,
    )
    this._events.windowListenerKeydown = this._onKeyDownBackdrop.bind(this)
    if (this._isShowBigestButton) {
      this._events.clickBackdropButtonLeft = this._backdropPrevItem.bind(this)
      this._events.clickBackdropButtonRight = this._backdropNextItem.bind(this)
      this._refs.backdropNextItemButton.addEventListener(
        'click',
        this._events.clickBackdropButtonRight,
      )
      this._refs.backdropPrevItemButton.addEventListener(
        'click',
        this._events.clickBackdropButtonLeft,
      )
    }
    this._refs.backdropCloseButton.addEventListener(
      'click',
      this._events.backdropCloseButtonClickEvent,
    )
    window.addEventListener('keydown', this._events.windowListenerKeydown)
  }

  _hideBackdrop() {
    this._refs.backdrop.style.opacity = 0
    this._refs.backdrop.style.pointerEvents = 'none'
    this._removeBackdropElement()
    window.removeEventListener('keydown', this._events.windowListenerKeydown)

    this._refs.backdropCloseButton.removeEventListener(
      'click',
      this._events.backdropCloseButtonClickEvent,
    )
    delete this._events.backdropCloseButtonClickEvent
    delete this._events.windowListenerKeydown
    if (this._isShowBigestButton) {
      this._refs.backdropNextItemButton.removeEventListener(
        'click',
        this._events.clickBackdropButtonRight,
      )
      this._refs.backdropPrevItemButton.removeEventListener(
        'click',
        this._events.clickBackdropButtonLeft,
      )
      delete this._events.clickBackdropButtonLeft
      delete this._events.clickBackdropButtonRight
    }
    this._refs.overlay.removeEventListener(
      'click',
      this._onClickOverlay.bind(this),
    )
    this._stylingItem()
    if (this._isPagination) this._selectActivePagination()
  }

  _onClickOverlay(e) {
    this._hideBackdrop()
  }

  _removeBackdropElement() {
    const content = this._refs.backdrop.querySelector('.toffee__content')
    content.innerHTML = ''
  }

  _createBackdropElement(e) {
    const content = this._refs.backdrop.querySelector('.toffee__content')
    let newEl = [...e.children].map((el) => el.cloneNode(true))
    if (this._isShowBigestImg) {
      newEl = newEl.map((el) => {
        if (el.nodeName === 'IMG') {
          el.attributes.src.value = el.dataset.source
        }
        return el
      })
    }
    if (newEl.length > 0) {
      content.append(...newEl)
      content.style.zIndex = 1002
    }
  }

  _onKeyDownBackdrop(e) {
    switch (e.code) {
      case 'Escape':
        this._hideBackdrop()
        break
      case 'ArrowLeft':
        this._backdropPrevItem()
        break
      case 'ArrowRight':
        this._backdropNextItem()
        break
    }
  }

  _onBackdropClose() {
    this._hideBackdrop()
  }

  _backdropNextItem() {
    if (this._activeItem === this._refs.items.length - 1) {
      this._activeItem = 0
    } else {
      this._activeItem += 1
    }
    this._removeBackdropElement()
    this._createBackdropElement(this._refs.items[this._activeItem])
  }

  _backdropPrevItem() {
    if (this._activeItem === 0) {
      this._activeItem = this._refs.items.length - 1
    } else {
      this._activeItem -= 1
    }
    this._removeBackdropElement()
    this._createBackdropElement(this._refs.items[this._activeItem])
  }

  _setPagination() {
    const pagination = document.createElement('div')
    const paginationItem = []
    for (let i = 0; i < this._refs.items.length; i += 1) {
      paginationItem[i] = document.createElement('div')
      paginationItem[i].style.width = '20px'
      paginationItem[i].style.height = '20px'
      paginationItem[i].style.backgroundColor = 'red'
      paginationItem[i].style.borderRadius = '50%'
      paginationItem[i].classList.add('toffee__paginationItem')
      if (i !== this._refs.items.length - 1) {
        paginationItem[i].style.marginRight = '10px'
      }
    }

    pagination.classList.add('toffee__pagination')
    pagination.style.display = 'flex'
    pagination.style.justifyContent = 'center'
    pagination.style.padding = '20px'
    pagination.append(...paginationItem)
    this._refs.root.append(pagination)
    this._refs.pagination = pagination
    this._refs.paginationItems = paginationItem
  }

  _selectActivePagination() {
    this._refs.paginationItems.forEach((el, idx) => {
      if (idx === this._activeItem) {
        el.style.transform = 'scale(1.5)'
      } else {
        el.style.transform = 'scale(1)'
      }
    })
  }

  _onClickPagination(e) {
    if (e.target.classList.contains('toffee__paginationItem')) {
      this._activeItem = this._refs.paginationItems.indexOf(e.target)
      this._stylingItem()
      this._selectActivePagination()
    }
  }
}
