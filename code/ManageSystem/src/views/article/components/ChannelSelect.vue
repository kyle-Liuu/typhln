<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
const channelList = ref([])
defineProps({
  modelValue: {
    type: [Number, String]
  },
  width: {
    type: String
  }
})
const emit = defineEmits(['update:modelValue'])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  //   console.log(channelList.value)
}
getChannelList()
</script>
<template>
  <el-select
    :modelValue="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :style="{ width }"
  >
    <el-option
      v-for="item in channelList"
      :key="item.id"
      :label="item.cate_name"
      :value="item.id"
    />
  </el-select>
</template>
