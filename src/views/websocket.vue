<template>
  <div>
    <el-button @click="webSocketOnOpen" type="primary">连接</el-button>
    <el-button @click="webSocketOnClose" type="danger">断开</el-button>

    <br /><!--    <el-button type="info" @click="send">发送消息</el-button>-->
<!--    <el-input type="textarea" v-model="webSocketOnMessage" :rows="9" />-->
    <el-table :data="list" >
      <el-table-column type="selection" width="55" align="center" />
      <!--      <el-table-column label="ID" align="center" prop="id" />-->
      <!--    <el-table-column label="所属分组ID" align="center" prop="groupId" />-->
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="设备ID" align="center" prop="equipmentId" />
      <el-table-column label="报警类型" align="center" prop="alarmType" />
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.the_alarm_type" :value="scope.row.alarmType"/>-->
<!--        </template>-->
      <el-table-column label="报警级别" align="center" prop="alarmLevel" />
<!--      <template slot-scope="scope">-->
<!--        <dict-tag :options="dict.type.the_alarm_level" :value="scope.row.alarmLevel"/>-->
<!--      </template>-->
      <el-table-column label="时间" align="center" prop="createTime" />
<!--      <template slot-scope="scope">-->
<!--        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>-->
<!--      </template>-->
    </el-table>

<!--    <br />-->
<!--    <br />-->
<!--    <el-input type="textarea" v-model="list" :rows="9" /> 返回内容-->
<!--    <br />-->
<!--    <br />-->
  </div>
</template>

<script>

export default {
  dicts: ['the_alarm_type','the_alarm_level'],
  data() {
    return {
      // url: "ws://127.0.0.1:8080/websocket/search/list",
      url: "ws://127.0.0.1:8080/websocket/1",
// url: "ws://127.0.0.1:8080/websocket/2?a=1&b=2&c=3",
// url: "127.0.0.1:8080/equipment/data/testConnection",
//ws://127.0.0.1:8080/websocket/2?equipmentIds=1
//       url: "ws://127.0.0.1:8080/websocket/search/list",
      message: "",
      redata: "",
      ws: null,
      list:[]
    };
  },
  mounted(){
    this.initWebSocket(); //页面渲染的时候，对ws进行初始化
  },
  methods: {
    // web socket
    initWebSocket() {
      this.webSocket = null
      // 判断当前浏览器是否支持WebSocket
      if ('WebSocket' in window) {
        // 初始化weosocket(必须)  配置服务器端 WebSocket 接受 url， 此处按照自己的项目路径进行配置
        let socketUrl = "ws://127.0.0.1:8080/websocket/1"
        this.webSocket = new WebSocket(socketUrl) // 新建一个webstock对象
        this.webSocket.onopen = this.webSocketOnOpen
        this.webSocket.onmessage = this.webSocketOnMessage
        this.webSocket.onerror = this.webSocketOnError
        this.webSocket.onclose = this.webSocketOnClose
      } else {
        this.$message.error('当前浏览器不支持 websocket')
      }
    },
    webSocketOnOpen() {
      console.log('---连接建立成功---')
      this.heartbeatTimer = setInterval(() => {
        this.websocketsend('PING')
      }, 30 * 1000) // 30 秒发一次心跳包
    },
    webSocketOnError() {},
    webSocketOnMessage(e) {
      // 数据接收
      this.redata = JSON.parse(e.data)
      this.list.push(this.redata)
      // console.info('this.redata=', this.redata)
      console.log(this.list)
      //此处获取到服务器推送的数据，就可以进行后续操作 。。。
    },
    websocketsend(Data) {
      // 数据发送
      this.webSocket.send(Data)
    },
    webSocketOnClose(e) {
      console.log('断开连接', e)
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer) //清除定时器
      }
    }
  }
};
</script>
