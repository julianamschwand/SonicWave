<script setup>
</script>
<template>
  <header>About</header>
  <div>This project is made and maintained by Julian Amschwand</div>
  <div id="github-container">
    <div>
      <img id="github-text" src="/svg/github/github-text.svg" alt="">
      <img id="github-logo" src="/svg/github/github-icon.svg" alt="">
    </div>
    <div>
      <a href="https://github.com/julianamschwand/SonicWave" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Frontend
      </a>
      <a href="https://github.com/julianamschwand/SonicWaveBackend" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
        Backend
      </a>
    </div>
  </div>
</template>
<style scoped>
div {
  font-size: 20px;
}

#github-container {
  display: flex;
  flex-direction: column;
  margin-top: 100px;
  gap: 10px;
}

#github-container div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}

#github-text {
  height: 30px;
}

#github-logo {
  height: 45px;
}

a {
  display: flex;
  align-items: center;
  gap: 5px;
}

svg {
  height: 20px;
  width: 20px;
}
</style>