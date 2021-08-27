import ToffeeGalarry from './toffeeGallary.js'
import TabsList from './tabsList.js'

let t = new ToffeeGalarry({ root: 'toffee' })

const tabs = new TabsList()
const btn = document.querySelector('.tabsList__submitButton')
btn.addEventListener('click', () => {
  t.delete()
  t = new ToffeeGalarry(tabs.getResult())
})
