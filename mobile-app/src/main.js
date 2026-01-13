import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import 'leaflet/dist/leaflet.css'
import App from './App.vue'
import router from './router'

// Fix Leaflet marker icons
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const pinia = createPinia()
const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('Global Vue Error:', err)
  console.error('Info:', info)
  alert('Global Error: ' + err.message)
}

app.use(pinia)
app.use(router)

// Unregister any existing service workers to avoid caching issues
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered');
    }
  });
}

app.mount('#app')