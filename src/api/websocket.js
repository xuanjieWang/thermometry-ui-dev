  function initWebSocket() {
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
    }
  function webSocketOnOpen() {
      console.log('---连接建立成功---')
      this.heartbeatTimer = setInterval(() => {
        this.websocketsend('PING')
      }, 30 * 1000) // 30 秒发一次心跳包
    }
  function  webSocketOnError() {}
  function webSocketOnMessage(e) {
      // 数据接收
      this.redata = JSON.parse(e.data)
      this.list.push(this.redata)
      // console.info('this.redata=', this.redata)
      console.log(this.list)
      //此处获取到服务器推送的数据，就可以进行后续操作 。。。
    }
  function websocketsend(Data) {
      // 数据发送
      this.webSocket.send(Data)
    }
  function webSocketOnClose(e) {
      console.log('断开连接', e)
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer) //清除定时器
      }
    }

    export{
        initWebSocket,
        webSocketOnOpen,
        webSocketOnError,
        webSocketOnMessage,
        websocketsend,
        webSocketOnClose
    }

