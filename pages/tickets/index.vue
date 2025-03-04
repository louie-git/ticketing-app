<template>
  <div class="">
    <PageTitle page-title="Tickets"/>
  
    <PageHeader>
      
      <div class="h-full w-full rounded-md text-slate-800 flex gap-y-2 flex-col laptop:flex-row laptop:justify-between laptop:items-end ">
        <div class=" flex flex-col  tablet:flex-row gap-3 text-xs tablet:text-sm">
          <div class="flex-col flex items-center tablet:block">
            <p class="font-semibold">Status</p>
            <DropdownMenu :arr-menu-data="arrStatusMenu" @set-filter="fnSetStatus" :current-filter="objQuery.status"></DropdownMenu>
          </div>
          <div class="flex-col flex items-center tablet:block">
            <p class="font-semibold">Priority</p>
            <DropdownMenu :arr-menu-data="arrPriorityMenu" @set-filter="fnSetPriority"  :current-filter="objQuery.priority"></DropdownMenu>
          </div>
        </div>
  
        <form @submit.prevent="fnSearch">
          <div class="flex justify-between items-center border rounded-md h-7 tablet:h-8 bg-white max-w-96 mx-auto tablet:max-w-80 tablet:mx-0 w-full text-xs">
            <input class="outline-none py-1 px-2 w-full h-full" type="text" placeholder="Search..." v-model="strSearch">
            <font-awesome :icon="'magnifying-glass'" class="text-slate-800 text-xl px-2" @click="fnSearch"/>
          </div>
        </form>
      </div>
    </PageHeader>

    <!-- <div class="flex justify-end px-2 pb-3">
      <div class="flex w-44 justify-center gap-3 shadow-md px-4 py-1 bg-blue-950 rounded-md font-semibold cursor-pointer text-slate-50 hover:opacity-85 duration-200">
          <p class="font-semibold">Download All</p>
          <font-awesome :icon="'download'" class="text-xl"/>
      </div>
    </div> -->

    <!-- <TicketTable :arr-tickets="arrTickets" :num-total-tickets="numTotalTickets" :bln-loading="blnLoading"></TicketTable> -->

    <TableLayout>
      <template #header>
        <tr>
          <th scope="col" class="px-6 py-3 whitespace-nowrap" v-for="header in arrTableHeader">
            {{ header }}
          </th>
        </tr>
      </template>
      <template #loading v-if="blnLoading">
        <div class="w-full flex justify-center px-8 py-6 backdrop-blur-sm rounded-md">
          <Loading></Loading>
        </div>
      </template>
      <template #no-data v-if="arrTickets.length < 1 && !blnLoading">
        <p class="text-center mt-2">No data to show.</p>
      </template>
      <template #contents>
        <tr class="odd:bg-white  even:bg-gray-50 border-b" v-for="ticket in arrTickets">
          <th scope="row" class="table__row__layout font-medium text-gray-900 whitespace-nowrap">
            {{ ticket.ticket_number }}
          </th>
          <td class="table__row__layout whitespace-nowrap">
            {{ ticket.submitted_by.email }}
          </td>
          <td class="table__row__layout">
            {{ ticket.category }}
          </td>
          <td class="table__row__layout whitespace-nowrap">
            {{  dateFormat(ticket.createdAt)  }}
          </td>
          <td class="table__row__layout overflow-hidden max-w-56">
              <p class=" line-clamp-1">{{ ticket.description }}</p>
          </td>
          <td class="table__row__layout">
            <span class="px-2 py-1 rounded-md whitespace-nowrap" :class="infoFormater(ticket.status)">{{  ticket.status  }}</span>
          </td>
          <td class="table__row__layout">
            <span class="px-2 py-1 rounded-md whitespace-nowrap" :class="infoFormater(ticket.priority)">{{  ticket.priority  }}</span>
          </td>
          <td class="table__row__layout">
            <font-awesome :icon="'eye'" class="text-slate-800 cursor-pointer text-lg px-2" @click="fnShowModal(ticket)"/>
          </td>
        </tr>
      </template>
    </TableLayout>

    <Pagination :total-data="numTotalTickets" :current-page="numCurrentPage" :page-cursor="numPageCursor" @set-page="fnSetPage" ></Pagination>

    <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success"  @closeNotif="()=> objNotif.show = false"></Notification>


    <TicketModal v-if="blnShowModal" :obj-ticket="objTicket" @emitBlnShowModal="() => blnShowModal = false"></TicketModal>

  </div>
</template>

<script setup>

definePageMeta({
  middleware:['auth'],
  layout: 'main-layout'
})

import fetch from '../../api/fetch'
import { onMounted, watch } from 'vue';
import { status, priority } from '../../helpers/filters.js'
import PageHeader from '../../components/General/PageHeader.vue'
import notification from '../../helpers/notification.js'
import TableLayout from '../../components/General/TableLayout.vue'
import infoFormater from '../../helpers/infoFormater.js'
import TicketModal from  '../components/Modals/TicketModal.vue'
import dateFormat  from '~/helpers/dateFormat.js';

const arrTableHeader = ref([
'TIcket ID',
 'Submitted By',
 'Category',
 'Date',
 'Description',
 'Status',
 'Priority',
 'View'
])

const route = useRoute()
const config = useRuntimeConfig()

const blnLoading = ref(true)
const blnShowModal = ref(false)

const numTotalTickets = ref(0)
const numCurrentPage = ref(1)
const numPageCursor = ref(0)

const arrTickets = ref([])
const arrStatusMenu = ref(status)
const arrPriorityMenu = ref(priority)

const strSearch = ref('')

const objTicket = ref()
const objQuery = ref({})
const objNotif = ref({
  show:false,
  message: '',
  success: false
})

const fnNotif = (data) => {
  objNotif.value = notification(data)
  blnLoading.value = false
}

//emits functions
const fnSetPage = (page,cursor) => {
  numCurrentPage.value = page
  numPageCursor.value = cursor
  fnFetchData()
}

const fnSetStatus = (status) => {
  if(status === 'All') delete objQuery.value.status
  else objQuery.value.status = status
  numPageCursor.value = 0
  numCurrentPage.value = 1
  fnFetchData()
}

const fnSetPriority = (priority) => {
  if(priority === 'All') delete objQuery.value.priority
  else objQuery.value.priority = priority
  numPageCursor.value = 0
  numCurrentPage.value = 1
  fnFetchData()
}
//end emits


const fnSearch = () => {
  numCurrentPage.value = 1
  numPageCursor.value = 0
  strSearch.value && fnFetchData()
}

const fnSetPageQuery = () => {
  route.query.status && (objQuery.value.status = route.query.status)
  route.query.priority && (objQuery.value.priority = route.query.priority)
  route.query.search && (objQuery.value.search = route.query.search, strSearch.value = route.query.search)
  if(route.query.page){
    numCurrentPage.value = route.query.page > 5 ? 5 : parseInt(route.query.page)
    numPageCursor.value = route.query.page > 5 ? parseInt(route.query.page) - 5 : 0
  } 

  fnFetchData()
}


const fnShowModal = (ticket) => {
  objTicket.value = ticket
  blnShowModal.value = true
}



//Fetch Data
const fnFetchData = async() => {

  if(strSearch.value !== '') objQuery.value.search = strSearch.value
  else delete objQuery.value.search
  objQuery.value.page =  numCurrentPage.value + numPageCursor.value

  navigateTo({
    path: '/tickets',
    query: objQuery.value
  })

  blnLoading.value = true
  const {data, error_response} = await fetch.get(`${config.public.server_url}/tickets`,objQuery.value)
  if(error_response) {
    fnNotif({ message: error_response, success: false })
    return
  }
  arrTickets.value = [...data.tickets]
  numTotalTickets.value = data.total_tickets
  blnLoading.value = false
}

//Watch Search String
watch(strSearch, (val, oldVal) => {   //Refreshes the page when input box is empty
  if(val === '' && oldVal !== ' ')  fnFetchData()
})

onMounted( () => {
   fnSetPageQuery()
})



</script>

<style scoped>


</style>