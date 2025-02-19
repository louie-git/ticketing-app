<template>
  <div class="text-gray-500">
    <PageTitle :page-title="router.currentRoute.value.params.id" :ret-btn="true"/>


    <!-- <div class="rounded-md shadow-md mb-5 bg-indigo-50 mt-5 px-2" >
      <div class="mt-4 h-16 flex justify-center items-center tablet:justify-end   ">
        <form @submit.prevent="fnSearch">
          <div class="flex justify-between items-center border rounded-md h-10 bg-white max-w-96 tablet:max-w-80 w-full">
            <input class="outline-none py-1 px-2  " type="text" placeholder="Search..." v-model="strSearch">
            <font-awesome :icon="'magnifying-glass'" class="text-slate-800 text-xl px-2" @click="fnSearch"/>
          </div>
        </form>
      </div>
    </div> -->

    <!-- <PageHeader>
      
    </PageHeader> -->

    <!-- <div class="relative mt-2 laptop:grid laptop:grid-cols-2 gap-x-3"> -->

    <div class="relative w-full laptop:w-[40rem] mt-5">

      <TicketCardSkeleton v-if="blnLoading"></TicketCardSkeleton>
      
      <div class=" p-3 rounded-md shadow-md border" v-else>
        <p class="text-xl font-bold">{{ objTicket.category ? objTicket.category : '--' }}</p>
        <div class="flex items-center gap-2 my-2">
          <div class="h-16 w-16 border-4 border-indigo-950 rounded-full" v-if="objTicket.submitted_by.image" >
              <img src="" alt="user image"  class="object-cover h-full w-full rounded-full">
              <!-- <img v-else  class="object-cover h-full w-full rounded-full" src="~assets/images/cat1.jpg" alt=""> -->
          </div>
          <font-awesome v-else :icon="'user'" class="rounded-full w-8 h-8 p-3 border-indigo-950 border-4" />
          <div class="">
            <p class="font-bold">{{ objTicket.submitted_by.full_name }}</p>
            <p>{{objTicket.submitted_by.email}}</p>
          </div>
        </div>

        <div class="grid grid-cols-5 mb-2 min-h-28">  

          <div class="col-span-2 font-bold grid grid-rows-3 gap-2">
            <p>Date posted: </p>
            <p>Status: </p>
            <p>Priority: </p>
          </div>

          <div class="col-span-3 grid grid-rows-3 gap-2">
            <p>{{ objTicket.createdAt }}</p>
            <div>
              <Dropdown :options="arrStatusMenu" :current-value="objTicket.status" v-if="blnShowEditOpt" @update="fnSetStatus"/>
              <p v-else>{{ objTicket.status }}</p>
            </div>
            <div>
              <Dropdown :options="arrPriorityMenu" :current-value="objTicket.priority" v-if="blnShowEditOpt" @update="fnSetPriority"/>
              <p v-else>{{ objTicket.priority }}</p>
            </div>
          </div>

        </div>

        <div class="">
          <p class="font-bold">Description</p>
          <p>{{ objTicket.description }}</p>
        </div>

        <div class="my-3" >
          <p class="font-bold">Assignee</p>
          <p class="" v-if="!arrAssignedDev.length">No developers assigned.</p>
          <div  class="flex gap-3">
            <button v-if="blnShowEditOpt"> 
              <font-awesome :icon="'plus'" class="border p-0.5 rounded text-sm border-slate-400 text-slate-500 cursor-pointer" @click="fnToggleDevNamesOpt"/>
            </button>
          </div>
          <div  class="flex flex-wrap w-full bg-white  rounded-md text-sm overflow-y-auto transition-all duration-300"  :class=" blnShowDevelopers ? ' h-36 p-2 border': 'h-0 p-0 border-none' " v-if="blnShowEditOpt">
            <div v-for="dev in arrDevNames" 
            class="px-2 py-1 cursor-pointer border border-white w-1/2 rounded-md h-8"
            :class="fnCheckId(dev._id) ? 'bg-indigo-600 text-white': 'hover:bg-indigo-50'"
            @click="fnAssignDev(dev)">
              <p class="line-clamp-1">{{ dev.email }}</p>
            </div>
          </div>
          
          <div class="flex flex-wrap ">
            <div class="flex items-center gap-2 m-1 px-2 shadow-md rounded-md justify-center py-1 hover:bg-indigo-200 bg-indigo-100 text-slate-900" v-for="assignee in arrAssignedDev">
              <div class="w-8 h-8 text-center">
                <img v-if="assignee.image" class="object-cover w-full h-full rounded-full"  src="~assets/images/cat1.jpg" alt="">
                <font-awesome v-else :icon="'user'" class="rounded-full w-3 h-3 text-sm p-2 border-indigo-950 border bg-slate-50" />
              </div>
              <div class=" leading-3  text-center">
                <p class="text-sm ">{{ assignee.first_name }} {{ assignee.last_name }}</p>
                <p class="text-xs">{{ assignee.email }}</p>
              </div>
            </div>
          </div>
        </div>


        <div class="">
          <p class="font-bold ">Uploaded Images</p>
          <div class="flex gap-2 flex-row flex-wrap">
            <div class="w-20 h-20 relative cursor-pointer" v-for="file in objTicket.files" @click="fnImageModal(file.name)">
                <img class="h-full w-full object-cover rounded-md " :src="`${config.public.server_url}/uploads/${file.name}`" alt="image" >
                <div class="absolute top-0 w-full h-full opacity-0 flex justify-center items-center hover:opacity-100 bg-black/50  transition-all duration-200 rounded-md">
                  <p class="px-1  text-white text-sm">expand</p>
                </div>
            </div>
          </div>
        </div>


        <!-- Ticket Card Footer -->
        <div class="mt-4 flex justify-end gap-5 items-end" >
          <Loading v-if="blnEditLoading"></Loading>
          <div class="font-medium">
            <div class="flex gap-2"  v-if="blnShowEditOpt">
              <button class="px-3 py-1 bg-indigo-950 text-white rounded-md hover:opacity-85"  @click="fnCancelEdit">Cancel</button>
              <button class="px-3 py-1 bg-indigo-950 text-white rounded-md hover:opacity-85" @click="fnUpdateTicket">Save</button>
            </div>
            <div class="flex gap-2" v-else>
              <button class="px-3 py-1 bg-indigo-950 text-white rounded-md hover:opacity-85" @click="() => blnShowEditOpt = true">Edit</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Message section -->
      <!-- <div class="my-5 laptop:my-0 h-auto ">
        <div class="flex text-white font-medium gap-1"> -->
          <!-- <button class="
          px-3 
          py-1 
          rounded-md 
          shadow-md 
          border 
          transition-colors 
          duration-200
          " 
          :class="btn.isActive ? 'bg-indigo-950 hover:bg-indigo-950/70': 'bg-none text-black hover:bg-gray-100 '" 
          v-for="(btn, index) in arrActionBtns"
          @click="fnActiveBtn(index)"
          >{{ btn.name }}</button> -->
        <!-- </div> -->

        <!-- <ChatBox title="Reply" :messages="objTicket.messages" :ticket-id="objTicket._id"/> -->
        <!-- <ChatBox title="Notes" v-else/> -->
      <!-- </div> -->

    </div>
    <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success" @closeNotif="()=> objNotif.show = false"></Notification>
    <ImageModal v-if="blnToggleImageModal" :image="strImage" @toggle-modal="fnCloseModal"></ImageModal>
    
   
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'main-layout'
})

import fetch from '../../api/fetch'
import Dropdown from '../../components/General/Dropdown.vue'
import { status, priority } from '../../helpers/filters.js'
import { onMounted } from 'vue';
import TicketCardSkeleton from '~/components/Loading/TicketCardSkeleton.vue';
import ImageModal from '~/components/Modals/ImageModal.vue';
import notification from '../../helpers/notification.js'

const router = useRouter()
const config = useRuntimeConfig()
const strTicketStatus = ref()
const strTicketPriority = ref()
const strImage = ref('')

const arrStatusMenu = ref(status)
const arrPriorityMenu = ref(priority)
const arrDevNames = ref()
const arrNewAssignedDevID = ref()
const arrAssignedDev = ref([])
const arrImages = ref(['cat1.jpg', 'cat2.jpg', 'cat3.jpg'])

const blnLoading = ref(false)
const blnEditLoading = ref(false)

const blnShowDevelopers = ref(false)
const blnShowEditOpt = ref(false)
const blnToggleImageModal = ref(false)

const intStatusKey = ref()
const intPriorityKey = ref()

const objTicket = ref({submitted_by: {}})
const objNotif = ref({
  show: false,
  message: '',
  success: false
})


const fnNotif = (data) =>{
  objNotif.value = notification(data)
  blnLoading.value = false
}

const fnToggleDevNamesOpt = () => blnShowDevelopers.value = !blnShowDevelopers.value

const fnSetStatus = (data) => {

  intStatusKey.value = data.item_id
  objTicket.value.status = data.name
} 

const fnSetPriority = (data) => {
  intPriorityKey.value = data.item_id
  objTicket.value.priority = data.name
}

const fnAssignDev = (dev) => {

  if ( arrNewAssignedDevID.value.includes(dev._id) ){
    const index = arrNewAssignedDevID.value.indexOf(dev._id)
    arrNewAssignedDevID.value.splice(index,1)
    arrAssignedDev.value = arrAssignedDev.value.filter(names => names._id != dev._id)
    return
  }
  arrNewAssignedDevID.value.push(dev._id)
  arrAssignedDev.value.push(dev)
}


const fnCheckId = (id) => {
  const assignedDevId = arrAssignedDev.value.map(data => data._id)
  return assignedDevId.includes(id) ? true : false
}


const fnCancelEdit = () => {
  blnShowEditOpt.value = false
  strTicketPriority.value = objTicket.value.priority
  strTicketStatus.value = objTicket.value.status
  arrAssignedDev.value = [...objTicket.value.assignee]
}

const fnImageModal = (image) => {
  blnToggleImageModal.value = true
  strImage.value = image 
}

const fnCloseModal = () => blnToggleImageModal.value = false

const fnUpdateTicket = async () => {
  blnEditLoading.value = true
  const {response, error_response} = await fetch.post(`${config.public.server_url}/tickets/${router.currentRoute.value.params.id}`, {
    status: intStatusKey.value,
    priority:  intPriorityKey.value,
    assignee: arrNewAssignedDevID.value
  })
  if( error_response ) {
    fnNotif({message: error_response, success:false})
    return
  }
  fnNotif({message : response, success: true})
  blnLoading.value = false
  blnEditLoading.value = false
  blnShowEditOpt.value = false
}

//Fetch developers
const fetchUserData = async () => { 
  const { data,error_response } = await fetch.get(`${config.public.server_url}/users/developers`)
  if(error_response) {
    fnNotif({message: error_response, success:false})
    return
  }
  arrDevNames.value = data.developers
}

const fnFetchData = async () => {

  blnLoading.value = true
  const {data, error_response} = await fetch.get(`${config.public.server_url}/tickets/${router.currentRoute.value.params.id}`)
  if(error_response) {
    fnNotif({message: error_response, success:false})
    return
  }
  objTicket.value = {...data}
  arrAssignedDev.value = [...data.assignee]
  blnLoading.value = false
  arrNewAssignedDevID.value = arrAssignedDev.value.map(dev => dev._id)
}

onMounted(async () => {
  await fnFetchData()
  await fetchUserData()
})

</script>


<style scoped>

</style>