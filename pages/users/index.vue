<template>
  <div class="flex flex-col h-[86vh]">
    <PageTitle page-title="Users"/>


    <PageHeader>
        <div class="h-full w-full flex justify-center items-end tablet:justify-end ">
          <form @submit.prevent="fnSearch">
            <div class="flex justify-between items-center border rounded-md h-8 tablet:h-10 bg-white max-w-96 tablet:max-w-80 w-full">
              <input class="outline-none  px-2  " type="text" placeholder="Search..." v-model="strSearch">
              <font-awesome :icon="'magnifying-glass'" class="text-slate-800 text-xl px-2" @click="fnSearch"/>
            </div>
          </form>
        </div>
    </PageHeader>

    <div class="">

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
        <template #no-data v-if="arrUsers.length < 1 && !blnLoading">
          <p class="text-center mt-2">No data to show.</p>
        </template>
        <template #contents v-else>
          <tr class="odd:bg-white  even:bg-gray-50 border-b last:border-b-0" v-for="user in arrUsers">
            <th scope="row" class="table__row__layout font-medium text-gray-900 whitespace-nowrap">
              {{ user.last_name }}
            </th>
            <td class="table__row__layout whitespace-nowrap max-w-48 overflow-hidden text-ellipsis">
              {{ user.first_name }}
            </td>
            <td class="table__row__layout max-w-48 whitespace-nowrap overflow-hidden text-ellipsis">
              {{ user.email }}
            </td>
            <td class="table__row__layout whitespace-nowrap">
              {{  user.designation  }}
            </td>
            <td class="table__row__layout max-w-56 whitespace-nowrap">
              {{ dateFormat(user.createdAt) }}
            </td>
            <td class="table__row__layout max-w-56 whitespace-nowrap">
              <span class="px-2 py-1 rounded-sm" :class="infoFormater(user.status.name)">{{ user.status.name }}</span>
            </td>
            <td class="table__row__layout max-w-56 whitespace-nowrap">
              <font-awesome :icon="'eye'" class="text-slate-800 cursor-pointer text-lg px-2" @click="fnShowModal(user)"/>
            </td>
          </tr>
        </template>
      </TableLayout>
    
      <UserDetailsModal v-if="blnShowModal" :arr-designations="arrDesignations" :obj-user-details="objUserDetails" @close-modal="blnShowModal = false" @user-update="fnUserUpdate"></UserDetailsModal>

      <Pagination :total-data="numTotalUsers" :current-page="numCurrentPage" :page-cursor="numPageCursor" @set-page="fnSetPage" ></Pagination>

      <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success" @closeNotif="()=> objNotif.show = false"></Notification>
    </div>



  </div>
</template>

<script setup>

import UserDetailsModal from '../../components/Users/UserDetailsModal.vue'
import PageHeader from '../../components/General/PageHeader.vue'
import fetch from '../../api/fetch'
import infoFormater from '../helpers/infoFormater.js'
import TableLayout from '../../components/General/TableLayout.vue'
import dateFormat from '~/helpers/dateFormat.js'

definePageMeta({
  middleware: ['auth'],
  layout: 'main-layout'
})

const route = useRoute()

const blnLoading = ref(false)
const blnShowModal = ref(false)

const strSearch = ref('')

const numCurrentPage = ref(1)
const numPageCursor = ref(0)
const numTotalUsers = ref(0)

const objQuery = ref({})
const objUserDetails = ref({})
const objNotif = ref({
  show: false,
  message: '',
  success: false
})

const arrUsers = ref([])
const arrDesignations = ref([])
const arrTableHeader = ref([
  'Last Name',
  'First Name',
  'Email',
  'Designation',
  'Date Created',
  'Status',
  'View'
])

const config = useRuntimeConfig()


const fnShowErrorNotif = (message) => {
  objNotif.value = {
    show: true,
    message,
    success: false
  }
  blnLoading.value = false

}


//emits functions
const fnUserUpdate = (response) => {
  objNotif.value = {
    show : true,
    message: response.message,
    success: response.success
  }
  fnFetchData()
}


const fnSetPage = (page,cursor) => {
  numCurrentPage.value = page
  numPageCursor.value = cursor
  fnFetchData()
}
//end emits

const fnShowModal = (user) => {
  objUserDetails.value = user
  blnShowModal.value = true
}


const fnSearch = () => fnFetchData()

watch(strSearch,(search, prevChar) => (search === '' && prevChar !== ' ') && fnFetchData() ) 

const fnSetPageQuery = () => {
  route.query.search && (objQuery.value.search = route.query.search, strSearch.value = route.query.search)
  if(route.query.page){
    numCurrentPage.value = route.query.page > 5 ? 5 : parseInt(route.query.page)
    numPageCursor.value = route.query.page > 5 ? parseInt(route.query.page) - 5 : 0
  } 
  fnFetchData()
}


const fnFetchData = async () => {

  if(strSearch.value !== '') objQuery.value.search = strSearch.value
  else delete objQuery.value.search
  objQuery.value.page =  numCurrentPage.value + numPageCursor.value

  navigateTo({
    path: '/users',
    query: objQuery.value
  })

  blnLoading.value = true
  const {data, error_response} = await fetch.get(`${config.public.server_url}/users`, objQuery.value)
  if (error_response) {
    fnShowErrorNotif(error_response)
    return
  }
  arrUsers.value = data.users
  numTotalUsers.value = data.total_users
  blnLoading.value = false
}

const fnGetDesignations = async () => {
  const {data, error_response} = await fetch.get(`${config.public.server_url}/designations/active`)
  if(error_response) {
    fnShowErrorNotif(error_response)
    return
  }
  arrDesignations.value = data
}

onMounted(() => {
  fnGetDesignations()
  fnSetPageQuery()
})

</script>

<style lang="scss" scoped>

</style>