<template>
  <div>

    <PageTitle page-title="My Tickets"/>

    <PageHeader>
      <div class=" w-full h-full flex justify-end p-2">
        <button class="px-4 h-10  bg-indigo-950 rounded-md font-semibold text-slate-50 hover:opacity-85 duration-200" @click="toggleForm">Add Ticket</button>
      </div>
    </PageHeader>

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
      <template #contents v-else>
        <tr class="odd:bg-white  even:bg-gray-50 border-b" v-for="ticket in arrTickets">
          <th scope="row" class="table__row__layout font-medium text-gray-900 whitespace-nowrap">
            {{ ticket.ticket_number }}
          </th>
          <!-- <td class="table__row__layout whitespace-nowrap">
            {{ ticket.submitted_by.full_name }}
          </td> -->
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
            <NuxtLink :to="`/my-tickets/${ticket.ticket_number}`">
              <font-awesome :icon="'eye'" class="text-slate-800 cursor-pointer text-lg px-2" />
            </NuxtLink>
          </td>
        </tr>
      </template>
    </TableLayout>

    <!--  <div class="mt-10">
      <TicketTable  :arr-tickets="arrTickets" :num-total-tickets="numTotalData" :bln-loading="blnLoading"></TicketTable>
      <Pagination :total-data="numTotalData" :current-page="numCurrentPage" :page-cursor="numPageCursor" @set-page="fnSetPage"></Pagination>
    </div> -->

    <Pagination :total-data="numTotalData" :current-page="numCurrentPage" :page-cursor="numPageCursor" @set-page="fnSetPage"></Pagination>

    <AddTicketModal v-if="blnShowTicketModal" @close-modal="blnShowTicketModal=false" :arr-categories="arrCategories" @notification="fnNotification" @refresh="fnFetchData"></AddTicketModal>

    <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success"  @closeNotif="()=> objNotif.show = false"></Notification>
   
  </div>
</template>

<script setup>

definePageMeta({
  middleware: ['auth'],
  layout: 'main-layout'
})

import AddTicketModal from '../components/Modals/AddTicketModal.vue'
import fetch from '../api/fetch'
import PageHeader from '../components/General/PageHeader.vue'
import notification from '../../helpers/notification.js'
import TableLayout from '../../components/General/TableLayout.vue'
import infoFormater from '../../helpers/infoFormater.js'
import dateFormat from '../../helpers/dateFormat.js'
const a = dateFormat('fd')

infoFormater('unassigned')
const route = useRoute()
const config = useRuntimeConfig()

const blnShowTicketModal = ref(false)
const blnLoading = ref(false)
const arrCategories = ref([])
const arrTickets = ref([])
const numTotalData = ref()
const numCurrentPage = ref(1)
const numPageCursor = ref(0)
const objQuery = ref({})
const objNotif = ref({
  show: false,
  messag: '',
  success: false
})

const arrTableHeader = ref([
  'TIcket ID',
 'Category',
 'Date',
 'Description',
 'Status',
 'Priority',
 'View'
])



const fnNotif = (data) => {
  objNotif.value = notification(data)
  blnLoading.value = false
}
const fnNotification = (response) =>  fnNotif({message : response.message , success: response.success})


const toggleForm = () => blnShowTicketModal.value = !blnShowTicketModal.value

const fnSetPage = (page,cursor) => {
  numCurrentPage.value = page
  numPageCursor.value = cursor
  fnFetchData()
}

const fnSetPageQuery = () => {
  // route.query.status && (objQuery.value.status = route.query.status)
  // route.query.priority && (objQuery.value.priority = route.query.priority)
  // route.query.search && (objQuery.value.search = route.query.search, strSearch.value = route.query.search)
  if(route.query.page){
    numCurrentPage.value = route.query.page > 5 ? 5 : parseInt(route.query.page)
    numPageCursor.value = route.query.page > 5 ? parseInt(route.query.page) - 5 : 0
  } 

  fnFetchData()
}


const fnFetchCategories = async () => {
  const {data, error_response} = await fetch.get(`${config.public.server_url}/categories/active`)
  if(error_response) {
    fnNotif({message : error_response, success: false})
    return
  }
  arrCategories.value = data
}

const fnFetchData = async () => {
  blnLoading.value = true
  objQuery.value.page =  numCurrentPage.value + numPageCursor.value

  navigateTo({
    path: '/my-tickets',
    query: objQuery.value
  })

  const {data , error_response} = await fetch.get(`${config.public.server_url}/tickets/my-tickets`, objQuery.value)
  if(error_response) {
    fnNotif({message : error_response, success: false})
    return
  }
  arrTickets.value = data.tickets,
  numTotalData.value = data.total_tickets
  blnLoading.value = false
} 

onMounted(() => {
  fnFetchCategories()
  fnSetPageQuery()
})


</script>

<style lang="scss" scoped>

</style>