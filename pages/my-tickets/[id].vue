<template>
  <div>
    <PageTitle :page-title="router.currentRoute.value.params.id" :ret-btn="true"/>

    <div class="flex flex-col laptop:flex-row gap-2 text-gray-800 mt-5 items-start">

      <div class="w-full flex flex-col gap-2 border p-2 rounded-md shadow-md
        laptop:max-w-[35rem]
        ">
        <div class="grid grid-cols-6">
          <p class="col-span-2 font-semibold">Category:</p>
          <p class="col-span-4">{{ objTicket.category }}</p>
        </div>
        <div class="grid grid-cols-6">
          <p class="col-span-2 font-semibold">Status:</p>
          <p class="col-span-4">{{ objTicket.status }}</p>
        </div>
        <div class="grid grid-cols-6">
          <p class="col-span-2 font-semibold">Priority:</p>
          <p class="col-span-4">{{ objTicket.priority }}</p>
        </div>
        <div class="grid grid-cols-6">
          <p class="col-span-2 font-semibold">Date Created:</p>
          <p class="col-span-4">{{ dateFormat(objTicket.createdAt) }}</p>
        </div>
        <div>
          <p class="font-semibold">Description</p>
          <p>{{ objTicket.description }}</p>
        </div>
        <div class="">
          <p class="font-semibold">Assigned developers</p>
          <p v-if="false">No developers assigned yet.</p>
          <div v-else class="flex gap-2 flex-wrap mt-2 " >
            <div class="flex items-center border px-2 py-1 rounded-md gap-2 max-w-96" v-for="dev in arrAssignee">
              <font-awesome :icon="'user'" class="rounded-full w-3 h-3 text-sm p-2 border-indigo-950 border bg-slate-50" />
              <div class="text-xs tablet:text-sm">
                <p class="break-words">{{ dev.first_name }} {{ dev.last_name }}</p>
                <p class="break-all w-full">{{ dev.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="border p-2 rounded-md w-full  shadow-md">
        <p class="font-semibold ">Uploaded Images</p>
        <div class="flex gap-2 flex-row flex-wrap mt-2">
          <div class="w-20 h-20 relative cursor-pointer" v-for="file in objTicket.files" @click="fnImageModal(file.name)">
            <img class="h-full w-full object-cover rounded-md " :src="`${config.public.server_url}/uploads/${file.name}`" alt="" >
            <div class="absolute top-0 w-full h-full opacity-0 flex justify-center items-center hover:opacity-100 bg-black/50 rounded-md transition-all duration-100">
              <p class="px-1  text-white text-sm">expand</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  <ImageModal v-if="blnToggleImageModal" :image="strImage" @toggle-modal="fnCloseModal"></ImageModal>

</template>

<script setup>

import fetch from '../../api/fetch'
import {onMounted} from 'vue'
import dateFormat from '~/helpers/dateFormat.js'
import ImageModal from '~/components/Modals/ImageModal.vue';


definePageMeta({
  layout: 'main-layout'
})

const router = useRouter()
const config = useRuntimeConfig()

const blnLoading = ref(false)
const objTicket = ref({})
const arrAssignee = ref([])
const blnToggleImageModal = ref(false)
const strImage = ref('')

const fnFetchData = async () => {
  blnLoading.value = true
  const {data, error_response} = await fetch.get(`${config.public.server_url}/tickets/${router.currentRoute.value.params.id}`)
  if(error_response) {
    fnNotif({message: error_response, success:false})
    return
  }
  objTicket.value = {...data}
  arrAssignee.value = [...data.assignee]
  blnLoading.value = false
}

const fnImageModal = (image) => {
  blnToggleImageModal.value = true
  strImage.value = image 
}


const fnCloseModal = () => blnToggleImageModal.value = false

onMounted(async() => {
  await fnFetchData()
})

</script>

<style lang="scss" scoped>

</style>