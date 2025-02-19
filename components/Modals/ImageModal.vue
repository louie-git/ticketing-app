<template>
  <!-- <div class="fixed h-full w-full bg-black/30 top-0 left-0 z-10 p-2 content-center">

    <div class="relative w-11/12 h-4/5 m-auto bg-white rounded-md tablet:h-4/5 laptop:w-10/12 desktop:w-9/12 overflow-hidden"> -->
      <Modal :title="image" content-type="image" @close-modal="$emit('toggleModal')">
        <p v-if="!image">Nothing to show</p>
        <img v-else class=" object-contain w-full h-5/6 mt-5 "  :src="`${config.public.server_url}/uploads/${image}`" alt="">
        <!-- <NuxtImg v-else class=" object-contain w-full h-5/6 mt-5 "  :src="`/_nuxt/assets/images/${image}`" alt=""></NuxtImg> -->
  
  
        <!-- <div>
          <font-awesome :icon="'xmark'" class="text-white absolute right-0 top-0 w-7 h-7 px-2 py-1 cursor-pointer" @click="$emit('toggleModal')" />
        </div> -->
      </Modal>
    <!-- </div>

  </div> -->
</template>

<script setup>

const config = useRuntimeConfig()
import Modal from '../../components/General/Modal.vue'

const props = defineProps(['image'])

</script>

