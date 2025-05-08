<template>
  <Modal title="Create Ticket" @close-modal="emit('close-modal')">
 
    <div class="p-3 flex-1 flex flex-col justify-between overflow-y-auto">
      <div class="grid grid-cols-1 gap-1">
        <div class="flex flex-col gap-1">
          <div class="relative border w-auto  rounded-md">
            <button class="w-full py-1 px-2 cursor-pointer flex justify-between"  @click="blnShowDropdown = !blnShowDropdown">
              <p>{{ strCategoryName || 'Select Category' }}</p>
              <div>
                <font-awesome :icon="'angle-down'" class="px-3 transition-all duration-300" :class="blnShowDropdown && 'rotate-180'" />
              </div>
            </button>
            <div class="absolute border top-9 bg-white w-full rounded-md transition-all duration-300" :class="blnShowDropdown ? '' : 'hidden'" >
              <div class="px-2 py-1 hover:bg-indigo-50 transition-colors duration-300 cursor-pointer" v-for="category in props.arrCategories" @click="strCategoryName = category.name , ticket.category = category.key, blnShowDropdown = false ">{{ category.name }}</div>
            </div>
          </div>
          
          <textarea class="border p-2 rounded-md outline-none w-full h-36 resize-none" name="" placeholder="Add Description" v-model="ticket.description"></textarea>
        </div>
        <form @submit.prevent="submitTicket()" enctype="multipart/form-data">
          <div class="
          h-40 
          border 
          rounded-md 
          flex 
          flex-col 
          items-center 
          justify-center
          " 
          :class="blnDragOver && 'bg-indigo-50'"
          @dragover.prevent="onDragOver" 
          @dragleave.prevent="onDragLeave" 
          @drop.prevent="fnDropImg"
          >
            <img class="w-10" src="~assets/icons/upload.png" alt="upload">
            <p>Drag image/s to upload or <label class="text-blue-500 cursor-pointer hover:text-blue-800" for="file-input">Browse</label></p>
            <input class="hidden" type="file" name="" id="file-input" ref="files" accept="image/png, image/gif, image/jpeg" multiple @change="onFileSelect">
          </div>
        </form>
        <p class=" text-red-600 text-xs" v-if="arrNotAllowedFiles.length > 0"  > {{fnCheckErrorFileAndCount()}} file/s type not allowed </p>
        <div class="text-xs flex justify-around py-2">
          <p>Allowed Formats: <span class="text-red-600">jpeg , png</span></p>
          <p>Maximum File Size: <span class="text-red-600">500Kb</span></p>
          <p>Maximum Files: <span class="text-red-600">2 Files</span></p>
        </div>
        <div class=" flex gap-2 flex-wrap">
          <div class="relative w-24 h-24 border rounded-md overflow-hidden " v-for="(img, index) in arrImages">
            <img :src="img.url" alt="uploaded image" class="object-contain w-full h-full m-auto bg-gray-950">
            <font-awesome :icon="'xmark'" class="w-4 h-4 rounded-full bg-white/50 absolute top-1 right-1  cursor-pointer hover:bg-white transition-colors duration-300" @click="fnRemoveImg(index)" />
          </div>
        </div>
      </div>
      <div class="mt-auto flex justify-end gap-x-2">
        <input class="px-4 py-1 bg-blue-950 rounded-md font-semibold text-slate-50 hover:opacity-85 duration-200" type="button" value="Clear" >
        <button class="px-4 py-1 bg-blue-950 rounded-md font-semibold cursor-pointer text-slate-50 hover:opacity-85 duration-200" @click="submitTicket()">Submit</button>
      </div>
    </div>
  </Modal>


</template>

<script setup>

import Modal from '../components/General/Modal.vue'
import fetch from '../../api/fetch'

const emit = defineEmits(['close-modal','notification'])

const props = defineProps({
  arrCategories: {
    type: Array,
    default: []
  }
})


const config = useRuntimeConfig()

const ticket = ref({})

const strCategoryName = ref('')
const blnShowDropdown = ref(false)
const blnFullDisplay = ref(false)
const blnDragOver = ref(false)

const arrImages = ref([])
const arrFormdataImages = ref([])
const arrNotAllowedFiles = ref([])

const onDragOver = () => blnDragOver.value = true

const onDragLeave = () => blnDragOver.value = false


const arrAllowedFileTypes = ["image/jpeg", "image/png"]



function fnuploadedFiles(files){  //Push files in array

  for(let i = 0; i < files.length; i++){
    arrFormdataImages.value.push(files[i]) // where the actual blob of file is saved.
    if(arrAllowedFileTypes.includes(files[i].type)){
      arrImages.value.push({
        name: files[i].name,
        url: URL.createObjectURL(files[i])
      })
    }
    else {
      arrNotAllowedFiles.value.push(files[i].name)
    }
  }
}

function fnCheckErrorFileAndCount () {
  arrNotAllowedFiles.value.length
  setTimeout(() => arrNotAllowedFiles.value = [] , 5000)
  return arrNotAllowedFiles.value.length
}

const fnDropImg = (event) => {
  blnDragOver.value = false
  const files = event.dataTransfer.files
  fnuploadedFiles(files)
}

const onFileSelect = (event) => {
  const files = event.target.files
  fnuploadedFiles(files)
}

const fnRemoveImg = (index) => {
  arrFormdataImages.value = arrFormdataImages.value.filter( (img, i) => i !== index)
  arrImages.value = arrImages.value.filter( (img,i) =>  i !== index)
}

const submitTicket = async () => {
  if(!ticket.value.category) {
    emit('notification', {
      message: 'Category is required.',
      success: false
    })
    emit('close-modal')
    return 
  }

  const formData = new FormData()
  formData.append('category' , ticket.value.category)
  formData.append('description' , ticket.value.description)
  
  for(let file of arrFormdataImages.value){
    formData.append('files', file)
  }

  const {response, error_response} = await fetch.post(`${config.public.server_url}/tickets`, formData)
  if(error_response) {
    emit('notification', {
      message: error_response,
      success: false
    })
    emit('close-modal')
    return 
  }
  emit('notification', {
    message: response,
    success: true
  })
  emit('close-modal')
  emit('refresh')
}

onMounted(() => {
  setTimeout(() => blnFullDisplay.value = true,10)
})

</script>

<style lang="scss" scoped>

</style>