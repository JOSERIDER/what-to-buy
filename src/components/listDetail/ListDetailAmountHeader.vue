<template>
  <div :style="{ 'background-color': color }" class="p-3 mb-1">
    <div class="flex justify-around color">
      <h1 class="text-2xl">Amount:</h1>
      <h1 class="text-2xl">{{ summary }} €</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "ListDetailAmountHeader",
  props: {
    color: {
      type: String,
      required: true,
    },
    summary: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.color {
  color: white;
}
</style>
