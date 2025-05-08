<template>
  <div class="p-2 text-gray-800 flex justify-center ali">
    <div class="w-full tablet:w-[45rem] shadow-md p-5">
      <div class="mt-10 text-center text-2xl font-semibold">
        <p>Password Reset</p>
      </div>
      <form @submit.prevent="fnSubmit">
        <div class="flex flex-col gap-5 mt-10">
          <div>
            <label for="password">New Password </label>
            <div class="flex items-center border-b-2 px-2">
              <input class="w-full h-10  focus:outline-none "  :type="blnShowPassword ? 'text' : 'password'" id="password" placeholder="Enter your password" v-model="strPassword">
              <font-awesome :icon=" blnShowPassword ? 'eye-slash' : 'eye' " class="text-md " @click="blnShowPassword = !blnShowPassword"/>
            </div>
          </div>
          
          <div>
            <label for="confirm_password">Confirm Password </label>
            <div class="flex items-center border-b-2 px-2">
              <input class="w-full h-10  focus:outline-none "  :type="blnShowConfirmPassword ? 'text' : 'password'" id="confirm_password" placeholder="Enter your password" v-model="strConfirmPassword">
              <font-awesome :icon=" blnShowConfirmPassword ? 'eye-slash' : 'eye' " class="text-md " @click="blnShowConfirmPassword = !blnShowConfirmPassword"/>
            </div>
          </div>
    
        </div>
        <div class="h-7 mt-5 text-center">
          <p v-if="blnPasswordError" class="text-red-600 font-semibold">{{ strPasswordError }}</p>
        </div>
    
        <div class="flex justify-center mt-5">
          <input type="submit" class="bg-indigo-950 text-white font-semibold px-7 py-2 rounded-md cursor-pointer hover:bg-indigo-950/80 shadow-md" value="Confirm" @click="fnSubmit">
        </div>
      </form>
  
    </div>
  </div>
  <Notification v-if="objNotif.show" :bln-show-notif="objNotif.show" :message="objNotif.message" :is-success="objNotif.success"  @closeNotif="()=> objNotif.show = false"></Notification>


</template>

<script setup>
import fetch from '~/api/fetch'
import Notification from '~/components/Notification.vue'
import notification from '../../helpers/notification.js'


let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
let uppercaseFormat = /[A-Z]/

const route = useRoute()

const blnShowPassword = ref(false)
const blnShowConfirmPassword = ref(false)

const strPassword = ref('')
const strConfirmPassword = ref('')

const strPasswordError = ref()
const blnPasswordError = ref(false)
const objNotif = ref({
  show: false,
  message: '',
  success: false
})

const blnLoading = ref(false)

const config = useRuntimeConfig()


const fnNotif = (data) =>{
  objNotif.value = notification(data)
  blnLoading.value = false
}


const fnSubmit = async () => {

  console.log(route.query.token)

  blnPasswordError.value = false
  strPasswordError.value = ''

  if(strPassword.value.length < 8) {
    blnPasswordError.value = true
    strPasswordError.value = 'Password should contain at least 8 characters.'
    return
  };

  if(!format.test(strPassword.value)) {
    blnPasswordError.value = true
    strPasswordError.value = 'Password must contain special characters.'
    return
  };
  if(!uppercaseFormat.test(strPassword.value)) {
    blnPasswordError.value = true
    strPasswordError.value = 'Password must contain uppercase.' 
    return
  };

  if(strPassword.value !== strConfirmPassword.value) {
    blnPasswordError.value = true
    strPasswordError.value = 'Password not matched.'
    return
  };

  const {response, error_response} = await fetch.post(`${config.public.server_url}/reset_password?token=${route.query.token}`, {password: strPassword.value, confirm_password: strConfirmPassword.value});
  if(error_response) {
    fnNotif({message : error_response, success: false});
    return
  };
  fnNotif({message: response, success:true});
}
</script>

<style lang="scss" scoped>

</style>