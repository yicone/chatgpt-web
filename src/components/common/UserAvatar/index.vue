<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NAvatar, NButton, useMessage } from 'naive-ui'
import { useRoute } from 'vue-router'
import { useAuthStore, useUserStore } from '@/store'
import { fetchAuth, fetchGetWeChatCodeUrl } from '@/api'
import defaultAvatar from '@/assets/avatar.jpg'
import { isString } from '@/utils/is'
import Permission from '@/views/chat/layout/Permission.vue'
import { useBasicLayout } from '@/hooks/useBasicLayout'

const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()
const ms = useMessage()
const { isMobile } = useBasicLayout()
const isWeChat = ref(false)
const loading = ref(false)
const showPermission = ref(false)

const getUrlParam = (name: string) => { //封装方法
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; //返回参数值

}

isWeChat.value = /micromessenger/i.test(navigator.userAgent || '')

onMounted(async () => {
  if (isWeChat.value && !authStore.token) {
    const code = getUrlParam('code')
    const redirectUrl = encodeURIComponent(document.location.origin)
    if (!code) {
      const scope = 'snsapi_userinfo'
      const result = await fetchGetWeChatCodeUrl(redirectUrl, scope)
      window.location.href = result.data.url
    } else {
      try {
        loading.value = true
        const result = await fetchAuth('wechat', {code})
        await authStore.setToken(result.data.token)
        ms.success('success')
        window.location.replace('/')
      }
      catch (error: any) {
        ms.error(error.message ?? 'error')
      }
      finally {
        loading.value = false
      }
    }
    return
  }

  const sign = route.query.verifyresetpassword as string
  if (sign)
    showPermission.value = true
})

const needPermission = computed(() => {
  if (isWeChat.value) {
    return false
  }
  return !!authStore.session?.auth && !authStore.token && (isMobile.value || showPermission.value)
})

const userInfo = computed(() => userStore.userInfo)
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(userInfo.avatar) && userInfo.avatar.length > 0">
        <NAvatar size="large" round :src="userInfo.avatar" :fallback-src="defaultAvatar" />
      </template>
      <template v-else>
        <NAvatar size="large" round :src="defaultAvatar" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 v-if="userInfo.name" class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ userInfo.name }}
      </h2>
      <NButton v-else tag="a" text @click="showPermission = true">
        <span v-if="!!authStore.session?.auth && !authStore.token" class="text-xl text-[#ff69b4] dark:text-white">
          {{ $t('common.notLoggedIn') }}
        </span>
        <span v-else class="text-xl text-[#ff69b4] dark:text-white">
          {{ authStore.session?.title }}
        </span>
      </NButton>
    </div>
    <Permission :visible="needPermission" />
  </div>
</template>
