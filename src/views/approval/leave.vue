<template>
  <div class="quitApproval">
    <div class="contLeft">
      <h2>{{ information.user_name }}申请请假</h2>
      <div class="topTit">
        <img src="@/assets/common/img.jpeg" alt>
        <div class="info">
          <p class="name">
            <strong>{{ information.username }}</strong>
          </p>
          <p>
            <span>部门：{{ information.departmentName }}</span>
          </p>
          <p>
            <span>入职时间： {{  formatTime(information.timeOfEntry) }}</span>
          </p>
        </div>
      </div>
      <div class="content">
        <p>
          <span>申请类型：</span>请假
        </p>
        <p>
          <span>请假类型：</span>
          {{ information.data.holidayType ==1 ?'事假' : '调休' }}
        </p>
        <p>
          <span>申请单位：</span>
          天
        </p>
        <p>
          <span>开始时间：</span>
          {{ formatTime(information.data.startTime) }}
        </p>
        <p>
          <span>结束时间：</span>
          {{ formatTime(information.data.endTime) }}
        </p>
        <p>
          <span>请假时长：</span>
          {{ information.data.duration }}
        </p>
        <p>
          <span>申请事由：</span>
          {{ information.data.reason }}
        </p>
      </div>
    </div>
    <div class="contRit">
      <div class="topTit">
        <strong>审批记录</strong>
      </div>
      <div class="Items">
        <li v-for="(item, index) in taskInstanceOutList" :key="index">
          <div class="name" :style="index==taskInstanceOutList.length-1?'border-right:none':''">
            <p>{{ formatTime(item.handleTime) }}</p>
          </div>
          <div class="act">
            <strong>{{ item.handleUserName }}</strong>
            <span v-if="index==0">发起申请</span>
            <span v-else-if="item.handleType == '3'">审批驳回</span>
            <span v-else-if="item.handleType == '4'">已撤销</span>
            <span v-else-if="item.handleType == '1'">未开始</span>
            <span v-else-if="item.handleType == '2'">审批通过</span>
            <span v-else>审批中</span>
          </div>
        </li>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getApprovalsDetail, getApprovalsTaskDetail, downImg } from '@/api/approval'
import { formatTime } from '@/utils'

const route = useRoute()
const approvalId = route.params.id
const information = ref({
  data: {}
})
const taskInstanceOutList = ref([])
const imgs = ref('')

const ApprovalsDetail = async () => {
  information.value = await getApprovalsDetail(approvalId)
  information.value.data = JSON.parse(information.value.procData)
}

const ApprovalsTaskDetail = async () => {
  taskInstanceOutList.value = await getApprovalsTaskDetail(approvalId)
}

// 图片下载
const getReviewHistory = async (id) => {
  const response = await downImg(id)
  imgs.value = 'data:image/png;base64,' + btoa(
    new Uint8Array(response.request.response).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
}

// 生命周期
ApprovalsDetail()
ApprovalsTaskDetail()
</script>