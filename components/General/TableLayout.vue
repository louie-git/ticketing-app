<template>


<div class="relative">

  <div class="relative overflow-x-auto h-[17.5rem] border border-gray-200 rounded-md shadow-md tablet:h-[20.5rem]">
    <table class="w-full text-xs tablet:text-sm text-left  text-gray-500 ">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <slot name="header">
        </slot>
      </thead>
      <tbody>
        <slot name="contents"/>
      </tbody>
  
    </table>
  
    <div class="absolute top-24 left-1/2 transform -translate-x-1/2 rounded-md">
      <slot name="loading">
      </slot>
    </div>
  
  </div>
  <div class="absolute flex w-full justify-center top-10">
    <slot name="no-data">
    </slot>
  </div>
</div>

</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>