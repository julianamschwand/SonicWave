<script setup>
import router from '@/router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

onMounted(async () => {
  await userStore.updateLogin()

  if (userStore.loggedIn) {
    await userStore.fetchUserData()
  }
})
</script>
<template>
  <div id="navbar">
    <div id="logo" @click="router.push('/home')">
      SonicWave
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368 347">
        <path style="stroke:none;" d="M6 0C9.64012 7.69467 15.0481 14.6659 19.3966 22C26.8122 34.507 33.7717 47.6595 39.5756 61C66.2408 122.291 75.6112 189.246 61.9969 255C57.595 276.26 50.974 296.986 42.5756 317C38.3879 326.98 31.9877 336.629 29 347L110 347L131 347C133.559 346.999 137.136 347.558 139.351 345.972C144.041 342.616 145.911 331.266 147.667 326C153.767 307.699 158.834 288.971 162.389 270C175.262 201.297 170.791 128.373 148.667 62C143.593 46.7788 138.037 31.5407 131.22 17C129.051 12.3731 127.269 5.04803 123.363 1.60339C120.906 -0.562958 117.027 0.00137329 114 0L92 0L6 0z"/>
        <path style="stroke:none;" d="M147 0C157.13 26.1112 167.291 51.7458 174.105 79C187.698 133.372 191.013 190.524 183.718 246C180.876 267.616 176.413 289.003 170.576 310C167.13 322.392 161.888 334.523 159 347L224 347C230.144 320.198 238.341 294.307 242.576 267C250.59 215.324 250.344 161.698 242.728 110C238.936 84.2574 232.778 58.8904 225.28 34C221.854 22.6284 216.673 11.5494 214 0L147 0z"/>
        <path style="stroke:none;" d="M225 0C228.141 13.5715 234.255 26.6353 238.28 40C245.779 64.898 251.591 90.3067 255.576 116C263.604 167.763 263.604 221.237 255.576 273C251.671 298.175 244.673 322.254 239 347L278 347C283.999 317.937 291.658 289.645 294.834 260C300.886 203.509 298.601 146.975 289.081 91C285.218 68.289 279.04 46.0777 272.576 24C271 18.6198 269.134 13.3083 267.333 8C266.521 5.60852 265.825 2.51862 263.581 1.02777C260.617 -0.941528 255.381 0 252 0L225 0z"/>
        <path style="stroke:none;" d="M279 0C284.44 23.516 292.749 46.2976 297.789 70C306.835 112.54 310.801 155.655 311.871 199C312.771 235.439 307.986 273.108 301.75 309C299.544 321.699 295.717 334.249 294 347L318 347C319.759 333.938 323.381 321.023 325.565 308C328.846 288.437 330.954 268.719 332.83 249C334.314 233.406 334 217.671 334 202C334 161.777 330.831 122.688 324.081 83C320.586 62.4495 315.748 42.0308 310 22C308.464 16.6483 307.28 4.39139 302.49 1.02777C300.449 -0.405151 297.349 0.00482178 295 0L279 0z"/>
        <path style="stroke:none;" d="M315 0C333.543 65.3417 345.821 131.944 345.821 200C345.821 249.525 339 298.526 329 347L345 347C349.194 314.527 356.664 282.807 358.91 250C362.773 193.591 359.554 136.734 350.247 81C346.886 60.8716 342.608 40.6261 337 21C335.547 15.9169 334.703 4.34842 330.297 1.02777C326.923 -1.51501 319.045 0 315 0z"/>
      </svg>
    </div>
    <div class="search-container">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFF">
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
        </svg>
      </div>
      <div>
        <input type="text" placeholder="Search for something ...">
      </div>
    </div>
    <button id="login-button" class="button-dark-hover" @click="router.push('/login')" v-if="!userStore.loggedIn">Login</button>
    <button id="account-button" class="button-light-hover" @click="router.push('/account')" v-else>
      {{ userStore.username }}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 20a6 6 0 0 0-12 0"/>
        <circle cx="12" cy="10" r="4"/>
        <circle cx="12" cy="12" r="10"/>
      </svg>
    </button>
  </div>
  <div id="seperator"></div>
</template>
<style lang="scss" scoped>
#navbar {
  height: 60px;
  width: 100%;
  background-color: var(--objects);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  box-sizing: border-box;
}

#seperator {
  height: 5px;
  width: 100%;
  background-color: var(--accent);
}

#logo {
  max-height: 35px;
  cursor: pointer;
  font-weight: 850;
  font-size: 26px;
  display: flex;
  align-items: center;
}

#logo svg {
  width: 38px;
  height: 38px;
  background-color: transparent;
  fill: var(--accent);
}

#login-button {
  height: 40px;
  width: 100px;
  border-radius: 5px;
  background-color: var(--accent);
  color: var(--background);
  font-weight: bold;
  font-size: 16px;
}

.search-container * {
  background-color: var(--background);
}

#account-button {
  height: 40px;
  cursor: pointer;
  background-color: var(--objects);
  gap: 10px;
  padding: 10px;
  padding-right: 5px;
  font-size: 14px;
}

#account-button svg{
  width: 30px;
  height: 30px;
  stroke: var(--accent);
}
</style>