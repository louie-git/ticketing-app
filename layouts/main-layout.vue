<template>
  <div class="relative font-body">

    <div class="absolute left-1/2 top-0 border w-7 h-7 bg-red-600 tablet:bg-green-600 laptop:bg-yellow-600 desktop:bg-blue-700 z-50 "></div>
    <header class="w-full h-12 tablet:h-14 flex justify-between items-center px-2 shadow-sm tablet:pl-64 bg-indigo-950 fixed z-10">
      <NuxtLink to="/" class="tablet:opacity-0">
        <p class="font-extrabold text-gray-50 ml-10">Ticketing System</p>
      </NuxtLink>
      <div class="flex items-center mr-2 gap-2 text-white text-[0.52rem] tablet:text-[0.7rem] laptop:text-xs laptop:mr-5">
        <font-awesome :icon="['far','calendar']" class=" text-base" />
        <div class="laptop:flex gap-2 px-1">
          <p class="">{{ strDate }}</p>
          <p class="" >{{objTime.hour}} : {{ objTime.minute }} : {{ objTime.second }}  {{ objTime.period }}</p>
        </div>
      </div>
    </header>



    <div class="w-64 fixed top-0 px-3 pb-10 h-full border bg-white z-10 transition-all ease-in-out duration-500 
    tablet:left-0 tablet:64 tablet:px-3" :class="showMenu ? 'left-0' : '-left-64'">
      <font-awesome 
      :icon="showMenu ? 'xmark': 'bars'" 
      :class="showMenu ? '' : ''" 
      class="text-xs cursor-pointer text-white absolute -right-10 top-2 tablet:hidden bg-indigo-950 w-5 h-5 p-1 rounded-md" @click="toggleMenu()" />
      <nav class="h-full flex flex-col justify-between w-full tablet:items-center">
        <div class="flex flex-col w-full h-full">
          <NuxtLink to="/">
            <div class="content-center h-14 text-center">
              <!-- <img class="w-10" src="~assets/icons/ticket.png" alt=""> -->
              <p class="font-extrabold text-slate-800 text-center text-xl">Ticketing System</p>
            </div>
          </NuxtLink>
          
          <div class="w-full grid grid-cols-6 bg-indigo-950 rounded-md px-2 h-20 items-center">
            <div class=" col-span-2 h-12 w-12 border-2 border-white rounded-full mx-auto">
              <!-- <img src="~assets/images/cat3.jpg" alt="" class="h-full w-full object-cover rounded-full"> //This is used for users that has image uploaded--> 
               <div class="w-full h-full flex justify-center items-center">
                 <font-awesome icon="user" class="text-xl text-white" />
               </div>
            </div>
            <div class="col-span-4 text-center flex flex-col gap-y-2 ">
              <p class="text-white text-start text-sm text-ellipsis font-semibold overflow-hidden line-clamp-1">{{objAuthUser.first_name}} {{ objAuthUser.last_name }}</p>
              <p class="text-xs text-slate-800 px-1 bg-white rounded-full">{{ objAuthUser.designation.name }}</p>
            </div>
          </div>

          <div class="flex-1 flex flex-col gap-y-2 tablet:align-middle mt-5 overflow-y-auto">
            <NuxtLink :to="menu.path" v-for="(menu, index) in sidebarMenus" 
              class=" font-semibold  px-2  rounded-md duration-200 transition-all ease-in-out"
              :class="menu.isActive? 'bg-indigo-950 text-indigo-50': 'hover:bg-indigo-100'"
              @click="activeMenu(index), toggleMenu()">
              <div class="flex gap-3 py-2 items-center">
                <!-- <img class="w-5 h-5" :src="`/_nuxt/assets/icons/${menu.icon}`" alt="">  -->
                <font-awesome :icon="`${menu.icon}`" class="text-xl w-10" />
                <span class="">{{ menu.name }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
        <div class="flex gap-3 rounded-md px-2 w-full py-1 my-1 shadow-lg cursor-pointer hover:bg-gray-100 transition-colors duration-300" @click="blnShowLogoutModal = true">
          <font-awesome :icon="'arrow-right-from-bracket'" class="text-xl" />
          <span>Logout</span>
        </div>
      </nav>
    </div>

    <div class="tablet:pl-64 transition-all ease-in-out duration-500">
      <div class="p-3 pt-16" >
        <slot />
      </div>
    </div>

    <div v-if="blnShowLogoutModal" class="absolute bg-gray-500/30 w-screen h-screen z-10 top-0 content-center p-4">
      <div class="max-w-96 bg-white h-48 mx-auto rounded-md p-4 text-center flex flex-col justify-around">
        <p class="text-lg font-bold text-gray-700">Are you sure you want to logout?</p>
        <div class="w-full flex justify-around">
          <button class="border px-3 p-1 rounded-md font-semibold border-red-500 bg-red-50 text-red-600" @click="blnShowLogoutModal = false">Cancel</button>
          <button class="border px-3 p-1 rounded-md font-semibold border-blue-800 bg-blue-50 text-blue-800" @click="fnLogout">Logout</button>
        </div>
      </div>
    </div>
  </div>
  
</template>


<script setup>
import auth from '../api/auth'
import fetch from '../api/fetch'
import dateFormat from '~/helpers/dateFormat'

const blnShowLogoutModal = ref(false)
const config = useRuntimeConfig()
const showMenu = ref(false)
const sidebarMenus = ref(auth.get().routes) 

const router = useRouter()
const objAuthUser = ref(auth.get().user)

const date = new Date()

const objTime = ref({
  hour: '00',
  minute: '00',
  second: '00',
  period: '--'
})

const strDate = ref('')
strDate.value = dateFormat(`${date.getFullYear()}-${date.getMonth() < 10 ? '0' : ''}${date.getMonth()}-${date.getDay() < 10 ? '' : '0'}${date.getDate()}`)
setInterval(() => {
  const currentTime = new Date()
  objTime.value = {
    // hour: `${currentTime.getHours() < 10 ? '0' : ''}${currentTime.getHours()}`,
    hour:   currentTime.getHours() > 12 ? `${(currentTime.getHours() - 12) < 10 ? '0': ''}${currentTime.getHours() - 12}` :  currentTime.getHours(),
    minute: `${currentTime.getMinutes() < 10 ? '0' : ''}${currentTime.getMinutes()}`,
    second: `${currentTime.getSeconds() < 10 ? '0' : ''}${currentTime.getSeconds()}` ,
    period: currentTime.getHours() < 12 ? 'AM' : 'PM' 
  }
}, 1000);

const objPagesIcons = {
  '/dashboard': 'house',
  '/tickets': 'clipboard-list',
  '/users': 'users',
  '/developers': 'code',
  '/account': 'circle-user',
  '/settings': 'gears',
  '/my-tickets': 'clipboard-user',
} 

sidebarMenus.value = sidebarMenus.value.map(page => {
  page.icon = objPagesIcons[page.path]
  return page
})


sidebarMenus.value = sidebarMenus.value.map((menu)=> {
  const path = router.currentRoute.value.path.split('/')[1]
  menu.path === `/${path}` ? menu.isActive = true : menu.isActive = false
  return menu
})


const dateTime = ref(Date())

const activeMenu = (index) => {
  sidebarMenus.value = sidebarMenus.value.map((menu, menuIndex) => {
    menuIndex === index ? menu.isActive = true : menu.isActive = false
    return menu
  })
}

window.onresize = () => {
  if (window.screen.width < 768) {
    showMenu.value = false
  }
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}


const fnLogout = async () => {
  try {
    await fetch.get(`${config.public.server_auth_url}/auth/logout`)
    localStorage.removeItem('auth')
    navigateTo('/')
  } catch (error) {
    console.log(error)
  }
}


</script>

<style scoped></style>