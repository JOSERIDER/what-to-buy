<template>
  <div class="h-full w-full flex justify-center items-center flex-col p-4">
    <img
      :src="require('@/assets/resources/slides/take-a-picture.svg')"
      class="w-48"
      alt="App icon"
    />
    <div class="text-xl text-center font-light mt-5">
      Upload your products
    </div>
    <span class="text-base font-extralight">
      Upload products is very easy: Take a cool picture, put a name, select
      product category and upload it !
    </span>
    <ion-button class="mt-5" fill="outline" @click="$emit('continue')">
      Continue
    </ion-button>
  </div>
</template>
