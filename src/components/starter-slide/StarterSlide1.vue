<template>
  <div class="h-full w-full flex justify-center items-center flex-col p-4">
    <img :src="require('@/assets/resources/wtb-logo.png')" alt="App icon" />
    <div class="text-xl text-center font-light mt-5">
      Welcome to WatToBuy App
    </div>
    <span class="text-base font-extralight">
      Let's Take a tour to get to know the best features of the application
    </span>
  </div>
</template>

<script>
export default {
  name: "StarterSlide1",
};
</script>

<style scoped>
img {
  max-width: 150px !important;
}
</style>
