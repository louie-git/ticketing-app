<template>
  <div class="absolute w-screen h-screen top-0 left-0 bg-gray-500/30 z-10 items-center flex justify-center">
    <div class="
    flex 
    transition-all 
    duration-500 
    flex-col 
    w-full 
    mx-1 h-5/6  
    rounded-lg 
    overflow-hidden 
    tablet:w-3/4 
    laptop:w-[45rem] 
    laptop:h-[40rem]
    "  
    :class="[blnFullDisplay ? 'scale-100': 'scale-75', props.contentType==='image' ? 'bg-zinc-800': 'bg-white']" 
    >
      <div class="relative bg-indigo-900 text-center py-2 text-lg font-bold text-white">
        <p>{{ title }}</p>
        <font-awesome :icon="'xmark'" class="w-7 h-7 absolute top-2 right-2 cursor-pointer" @click="() => emit('close-modal')" />
      </div>
      <slot></slot>

    </div>
  </div>
</template>

<script setup>

const emit = defineEmits(['close-modal'])
const blnFullDisplay = ref(false)

const props = defineProps({
  title: {
    type: String,
    default: '--'
  },
  contentType: {
    type: String,
    defaul: ''
  }
})
onMounted(() => {
  setTimeout(() => blnFullDisplay.value = true,10)
})


// const blnShowModal = ref(false)
// onMounted(() => {
//   setTimeout(() =>  blnShowModal.value = true , 20000)
// })

</script>

<style lang="scss" scoped>


</style>