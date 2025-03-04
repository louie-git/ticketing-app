<template>
  <div class="flex flex-col h-[91vh]">
    <PageTitle page-title="Developers"/>

    <PageHeader > 
      <div class="flex justify-center items-end tablet:justify-end h-full w-full ">
        <form @submit.prevent="fnSearch">
          <div class="flex justify-between items-center border rounded-md h-8 tablet:h-10 bg-white max-w-96 tablet:max-w-80 w-full">
            <input class="outline-none px-2  " type="text" placeholder="Search..." v-model="strSearch">
            <font-awesome :icon="'magnifying-glass'" class="text-slate-800 text-xl px-2" @click="fnSearch"/>
          </div>
        </form>
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
      <template #no-data v-if="arrDevelopers.length < 1 && !blnLoading">
        <p class="text-center mt-2">No data to show.</p>
      </template>
      <template #contents>
        <tr class="odd:bg-white  even:bg-gray-50 border-b" v-for="dev in arrDevelopers">
          <th scope="row" class="table__row__layout font-medium text-gray-900 whitespace-nowrap">
            {{ dev.full_name }}
          </th>
          <td class="table__row__layout whitespace-nowrap">
            {{ dev.email }}
          </td>
          <td class="table__row__layout">
            <span class="px-2 py-1 rounded-md" :class="infoFormater('pending')">{{ dev.pending }}</span>
          </td>
          <td class="table__row__layout">
            <span class="px-2 py-1 rounded-md" :class="infoFormater('in-progress')">{{ dev['in-progress'] }}</span>
          </td>
          <td class="table__row__layout">
            <span class="px-2 py-1 rounded-md" :class="infoFormater('completed')">{{ dev.completed }}</span>
          </td>
          <td class="table__row__layout">
            <NuxtLink :to="`/developers/${dev._id}`">
              <font-awesome :icon="'eye'" class="text-slate-800 cursor-pointer text-lg px-2" />
            </NuxtLink>
          </td>
        </tr>
      </template>
    </TableLayout>

    <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success"  @closeNotif="()=> objNotif.show = false"></Notification>

    <Pagination :total-data="numTotalDevs" :current-page="numCurrentPage" :page-cursor="numPageCursor" @set-page="fnSetPage" ></Pagination>

  </div>
</template>

<script setup>

definePageMeta({
  middleware:['auth'],
  layout: 'main-layout'
})

import fetch from '../../api/fetch'
import CardSkeleton from '~/components/Loading/CardSkeleton.vue';
import DevCard from '~/components/Developers/DevCard.vue';
import PageHeader from '../../components/General/PageHeader.vue'
import notification from '../../helpers/notification.js'
import TableLayout from '../../components/General/TableLayout.vue'
import infoFormater from '../../helpers/infoFormater.js'



import { watch } from 'vue';

const config = useRuntimeConfig()
const route = useRoute()

const arrDevelopers = ref([])

const strSearch = ref('')

const blnLoading = ref(false)

const numTotalDevs = ref(0)
const numCurrentPage = ref(1)
const numPageCursor = ref(0)

const objQuery = ref({})
const objNotif = ref({
  show: false,
  message: '',
  success: false
})

const arrTableHeader = ref([
  'Full Name',
  'Email',
  'Pending',
  'In-progress',
  'Completed',
  'View'
])


const fnNotif = (data) =>{
  objNotif.value = notification(data)
  blnLoading.value = false
}


const fnSearch = () => {
  numCurrentPage.value = 1
  numPageCursor.value = 0
  strSearch.value && fnFetchData()
  
}

const fnSetPage = (page,cursor) => {
  numCurrentPage.value = page
  numPageCursor.value = cursor
  fnFetchData()
}


const fnSetPageQuery = () => {
  route.query.search && (objQuery.value.search = route.query.search, strSearch.value = route.query.search)
  if(route.query.page){
    numCurrentPage.value = route.query.page > 5 ? 5 : parseInt(route.query.page)
    numPageCursor.value = route.query.page > 5 ? parseInt(route.query.page) - 5 : 0
  } 
  fnFetchData()
}



const fnFetchData = async() => {
  if(strSearch.value !== '') objQuery.value.search = strSearch.value
  else delete objQuery.value.search
  objQuery.value.page =  numCurrentPage.value + numPageCursor.value

  navigateTo({
    path: '/developers',
    query: objQuery.value
  })
  blnLoading.value = true
  arrDevelopers.value = [] //reset the obj
  const {data, error_response} = await fetch.get(`${config.public.server_url}/users/developers`,objQuery.value)
  if(error_response) {
    fnNotif({message : error_response, success: false})
    return
  }
  arrDevelopers.value = data.developers
  numTotalDevs.value = data.total_devs
  blnLoading.value = false
}

watch(strSearch,(search, prevChar) => {  // automatically fetch data when search bar is empty
  if(search === '' && prevChar !== ' ') fnFetchData()
})

onMounted(() => {
  fnSetPageQuery()
})

</script>

<style scoped>

</style>