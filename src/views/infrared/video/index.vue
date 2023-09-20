<template>
  <div class="app-container">
    <div>
      <el-row class="custom-row" style="display: flex; align-items: center;">
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">线上在运行红外相机数<br>{{ equipmentTempList[0].onlineE }}台</span>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">离线红外相机<br>{{ equipmentTempList[0].offlineE }}台</span><br>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">故障红外相机<br>{{ equipmentTempList[0].badE }}台</span><br>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">当天超温低温报警件数<br>{{ equipmentTempList[0].alarmNumTotalToday }}件</span>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">累计报警总数<br>{{ equipmentTempList[0].alarmNumTotal }}件</span><br>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <span class="card-content">红外相机总设备数<br>{{ equipmentTempList[0].etotal }}台</span><br>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 5px;">
        <div class="grid-container-wrapper">
          <template v-for="(item, index) in equipmentTempList">
            <div class="grid-container" :key="index">
              <el-card class="card2" style="height: 291px; width: 30%; word-wrap: break-word; word-break: break-all;">
                <!-- 卡片内容 -->
                <el-row style="text-align: center; margin-bottom: 40px">
                  实时温度信息
                  <el-tooltip class="item" effect="dark" content="查看曲线" placement="top">
                    <i class="el-icon-plus custom-icon" @click="showChart(index)"></i>
                  </el-tooltip>
                </el-row>
                <el-row style="height: 48px;">
                  <el-col><span>当前相机精确位置:{{ item.groupName }}</span></el-col>
                </el-row>
                <el-row style="height: 48px;">
                  <el-col><span>当前外表最低温度:{{ item.tempMin }}℃</span></el-col>
                </el-row>
                <el-row style="height: 48px;">
                  <el-col><span>当前外表最高温度:{{ item.tempMax }}℃</span></el-col>
                </el-row>
                <el-row style="height: 48px;">
                  <el-col><span>当前外表平均温度:{{ item.tempAvg }}℃</span></el-col>
                </el-row>
              </el-card>
              <div class="video-container">
                <div style="height: 296px; width: 100%; position: relative;">
                  <video :ref="'videoRef_' + index" :id="'video_' + index" height="100%" width="100%" muted="muted"
                    autoplay="autoplay" preload="auto"></video>
                </div>
              </div>
              <!--            <br v-if="(index+1) % 2 === 0" />-->
            </div>
          </template>
        </div>
        <div id="chartContainer" ref="chartContainer"
          style="background: #303133;margin-top: 2px; margin-bottom: 5px; height: 350px;">
        </div>
      </el-row>
    </div>
  </div>
</template>

<script lang="js">
import Wfs from '../../../api/mwfs.js'
import { EquipData, EquipTemp } from "@/api/equipment/data";
import axios from "axios";
import * as echarts from 'echarts';

export default {
  name: "Video",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      tablePage: {
        pageNum: 1, // 第几页
        pageSize: 10, // 每页多少条
        total: 5 // 总记录数
      },
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 5,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      //当前在线设备
      equipmentList: [],
      //当前设备温度
      equipmentTempList: [{}],
      // 存储 CancelToken 对象的数组
      cancelTokens: [],
      //关闭标志 默认为false也就是有请求正在发送
      isFetching: false,
      //定时器
      timerId: '',
      //视频存储
      videos: [],
      mychart: null,
      tempEchartCount: 0,
      chartData: [{}],
      endCountList: [],
      viodesID: [],
      count: [],
    };
  },

  created() {
    // 判断定时器是否已存在
    if (!this.timerId) {
      this.$nextTick(() => {
        const timerId = setInterval(() => {
          this.getTemp();
        }, 2000);
        this.timerId = timerId;
      });
    }
    this.endCountList = new Array(50)
    this.count = new Array(50)

    setInterval(() => {
      console.log("监控websocket连接,自动重连-----", this.getCurrentTime())
      this.endCountList.forEach((item) => {
        if (item == 0) {
          const ref = this.stopAllVideos()
          this.videos.forEach(wfs => wfs.destroy())

          if (ref) {
            this.mwfs();
          }
          return;
        }
      })
    }, 30000)
  },

  beforeDestroy() {
    clearInterval(this.timerId);
    // 取消所有未完成的请求
    this.cancelTokens.forEach(cancelToken => cancelToken.cancel());
    this.videos.forEach(wfs => wfs.destroy())
    window.removeEventListener('resize', this.resizeChart);
  },

  beforeRouteUpdate(to, from, next) {
    this.getTemp()
    next();
  },

  mounted() {
    console.log("111")
    //获取到图像的视频信息
    this.mwfs();
    //加载echarts
    this.tempEchart();
    window.addEventListener('resize', this.resizeChart);
    setTimeout(() => {
      this.showChart(0)
    }, 2000)

  },
  methods: {
    //使用定时器获取到温度数据， 刷新数据，刷新当前的数据信息
    getTemp() {
      if (this.isFetching) return;

      //先取消所有未完成的请求
      this.cancelTokens.forEach(cancelToken => cancelToken.cancel());
      this.cancelTokens = [];

      this.isFetching = true;

      const requests = this.equipmentList.map((item, index) => {
        const cancelToken = axios.CancelToken.source();
        this.cancelTokens.push(cancelToken);

        return EquipTemp(item, { cancelToken: cancelToken.token }).then(res => {
          this.$set(this.equipmentTempList, index, res.data);
        });
      });

      Promise.all(requests)
        .then(() => {
          this.mychart.setOption(this.options);
        })
        .finally(() => {
          this.isFetching = false;
        });
    },


    async mwfs() {
      if (Wfs.isSupported()) {
        //查询设备信息，同时开启定时任务5s一次获取到设备温度数据
        this.equipmentList = await this.getEquipmentTemp()
        for (let i = 0; i < this.equipmentList.length; i++) {
          const item = this.equipmentList[i];
          // 发送同步请求获取当前温度信息
          const res = await EquipTemp(item);
          this.$set(this.equipmentTempList, i, res.data);

          // 使用异步操作加载视频源
          await new Promise(async resolve => { // 将 Promise 函数添加 async 关键字标识
            this.$nextTick(() => {
              const videoRef = this.$refs[`videoRef_${i}`][0];
              const wfs = new Wfs();
              const promise = wfs.attachMedia(videoRef, item.id);
              if (promise) this.videos.push(wfs)
              let end

              this.viodesID[i] = setInterval(() => {
                if (videoRef.buffered.length) {
                  //判断上一次的值
                  this.endCountList[i] = (end === videoRef.buffered.end(0)) ? 0 : 1
                  end = videoRef.buffered.end(0);
                  if ((end - videoRef.currentTime) >= 0.5) videoRef.currentTime = videoRef.buffered.end(0)
                } else {
                  this.endCountList[i] = 0
                }
                console.log(this.endCountList[i])
              }, 500)

              // 在视频播放完毕时销毁相关对象，避免内存泄漏
              videoRef.addEventListener('ended', () => {
                this.stopVideo(i);  // 停止当前视频播放，并销毁 Wfs 对象
              })
              resolve();
            });
          });
        }
      }
    },

    // 停止指定位置的视频播放，并销毁对应的 Wfs 对象
    stopVideo(index) {
      const videoRef = this.$refs[`videoRef_${index}`][0];
      const wfs = this.videos[index];

      if (wfs) {
        wfs.destroy();
        this.videos.splice(index, 1);
      }

      if (videoRef && !videoRef.paused) {
        videoRef.pause();
      }
      clearTimeout(this.viodesID[index])
    },
    async stopAllVideos() {
      for (let index = 0; index < this.equipmentList.length; index++) {
        this.stopVideo(index)
      }
      console.log("所有的是视频都销毁完成")
      return true;
    },
    async getEquipmentTemp() {
      try {
        const res = await EquipData();
        return res.data;
      } catch (error) {
        console.error('获取设备数据出错：', error);
        return []; // 出错时返回一个空数组
      }
    },

    //点击按钮显示设备对应曲线
    showChart(index) {
      console.log("index: ", index)
      // 在点击按钮时清除之前的定时器
      clearInterval(this.timer);
      const item = this.equipmentTempList[index];
      // 检查是否获取到了正确的温度数据
      if (item && item.tempMin && item.tempAvg && item.tempMax) {
        const tempMin = item.tempMin;
        const tempAvg = item.tempAvg;
        const tempMax = item.tempMax;
        // 清空原有的数据
        this.options.series[0].data = ['', '', '', '', '', '', '', '', '', ''];
        this.options.series[1].data = ['', '', '', '', '', '', '', '', '', ''];
        this.options.series[2].data = ['', '', '', '', '', '', '', '', '', ''];
        this.options.xAxis.data = ['', '', '', '', '', '', '', '', '', ''];
        // 更新最高温度、最低温度和平均温度数据
        this.options.series[0].data.push([item.createTime, tempMin]);
        this.options.series[1].data.push([item.createTime, tempAvg]);
        this.options.series[2].data.push([item.createTime, tempMax]);
        // 判断xAxis.data数组长度是否超过固定长度
        if (this.options.xAxis.data.length >= 20) {
          // 删除最左边的数据
          this.options.series[0].data.shift();
          this.options.series[1].data.shift();
          this.options.series[2].data.shift();
          this.options.xAxis.data.shift();
        }
        // 更新xAxis的data属性
        this.options.xAxis.data.push([item.createTime]);
        // 重新设置图表的选项
        this.mychart.setOption(this.options);
        // 使用定时器每隔一段时间获取新的数据，并更新曲线图
        this.timer = setInterval(() => {
          const newItem = this.equipmentTempList[index];
          if (newItem && newItem.createTime !== item.createTime) {
            // 获取新的温度数据
            const newTempMin = newItem.tempMin;
            const newTempAvg = newItem.tempAvg;
            const newTempMax = newItem.tempMax;
            // 更新最高温度、最低温度和平均温度数据
            this.options.series[0].data.push([newItem.createTime, newTempMin]);
            this.options.series[1].data.push([newItem.createTime, newTempAvg]);
            this.options.series[2].data.push([newItem.createTime, newTempMax]);
            // 如果xAxis的data数组长度超过固定长度（例如40），就删除最左边的数据
            if (this.options.xAxis.data.length >= 20) {
              this.options.series[0].data.shift();
              this.options.series[1].data.shift();
              this.options.series[2].data.shift();
              this.options.xAxis.data.shift();
            }
            // 更新xAxis的data属性，添加新的时间点
            this.options.xAxis.data.push(newItem.createTime);
            // 重新设置图表的选项
            this.mychart.setOption(this.options);
          }
        }, 2000); // 每5秒获取一次数据，可以根据实际需要调整间隔时间
      }
    },

    //显示曲线
    tempEchart() {
      // 获取图表容器元素
      const chartContainer = document.getElementById('chartContainer');
      // 初始化图表实例
      this.mychart = echarts.init(chartContainer);
      // 配置图表选项
      this.options = {
        title: {
          text: '设备温度检测', // 设置标题文本
          top: 'bottom',
          left: 'center',
          // itemGap设置主副标题纵向间隔，单位px，默认为10，
          background: '#303133',
          // 主标题文本样式设置
          textStyle: {
            fontSize: 18,
            fontWeight: '500',
            color: '#dadada',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            snap: false,
            label: {
              backgroundColor: '#6a7985'
            }
          },
          //修改tooltip样式
          formatter: function (params) {
            let tooltipHtml = params[0].axisValue + '<br>'; // 在第一行显示时间
            params.forEach(function (param) {
              tooltipHtml += param.marker + param.seriesName + ': ' + param.value[1] + '℃<br>';
            });
            return tooltipHtml;
          }
        },
        legend: {
          data: ['最低温', '平均温', '最高温'],
          x: 'center',
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          textStyle: {
            color: '#dadada'  // 图例文字颜色
          },
        },
        grid: {
          show: false,  // 显示网格边框
          left: '3%',  // 根据需要调整离左侧的距离
          right: '4%',  // 根据需要调整离右侧的距离
          bottom: '10%',  // 根据需要调整离底部的距离
          containLabel: true,
          borderColor: '#999',  // 网格边框颜色
          splitLine: {
            show: true,  // 显示横向网格线
            lineStyle: {
              type: 'dashed',  // 设置横向网格线为虚线
              color: '#999',
            }
          }
        },
        xAxis: {
          type: 'category',
          //来控制坐标轴刻度与边界的距离的属性
          boundaryGap: false,
          data: [],  //移除初始时间
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value', // y 轴为数值类型
          // axisLabel: {
          //   formatter: '{value} °C', // 设置刻度标签的显示格式为温度单位（摄氏度）
          // },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: '最低温',
            type: 'line',
            //折线图上折线改为“平滑的曲线”通过smooth、stack实现
            smooth: 0.2,
            stack: 'Total',
            lineStyle: {
              width: 3,
              color: '#f2a6ac',
            },
            itemStyle: {
              color: '#f2a6ac'  // 设置平均温系列的圆心颜色
            },
            showSymbol: false,  //去除面积图节点圆
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#f5babe'
                },
                {
                  offset: 1,
                  color: '#fcdbdc'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [], //移除最低温数据
          },
          {
            name: '平均温',
            type: 'line',
            smooth: 0.2,
            stack: 'Total',
            lineStyle: {
              width: 3,
              color: '#e66a75'
            },
            itemStyle: {
              color: '#e66a75'  // 设置平均温系列的圆心颜色
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#e97881'
                },
                {
                  offset: 1,
                  color: '#ef99a0'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [], //移除平均温数据
          },
          {
            name: '最高温',
            type: 'line',
            smooth: 0.2, // 启用平滑曲线
            stack: 'Total',
            lineStyle: {
              width: 3,
              color: '#dc3548'
            },
            itemStyle: {
              color: '#dc3548'  // 设置平均温系列的圆心颜色
            },
            showSymbol: false,  //控制系列（如折线图、散点图等）中数据点符号是否显示的属性
            //区域填充色
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#db354e'
                },
                {
                  offset: 1,
                  color: '#f56c6c',
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: [], //移除最高温数据
          }
        ],
      };
      // 渲染图表
      this.mychart.setOption(this.options);
    },
    //宽度调整曲线图的宽度
    resizeChart() {
      if (this.mychart) {
        const chartContainer = document.getElementById('chartContainer');
        this.mychart.resize({
          width: chartContainer.offsetWidth
        });
      }
    },
    getCurrentTime() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();

      var currentTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      return currentTime;
    }
  }
};
</script>

<style>
.custom-row {
  flex-wrap: nowrap;
  /* 防止换行 */
}

.card-content {
  white-space: nowrap;
}

.card2 {
  background-color: #303133;
  color: white;
  border-color: #303133;
}

video {
  width: 100%;
  height: 98%;
  object-fit: fill;
  aspect-ratio: 16/9;
}

.grid-container {
  display: flex;
}

.grid-container-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  /* 设置两列的宽度 */
  column-gap: 0px;
  /* 列之间的间距 */
}

.video-container {
  width: 75%;
  margin-left: 0px;
}

.custom-col {
  flex: 0 0 calc(33.3333% - 8px);
  margin-right: 8px;
  box-sizing: border-box;
  /* 确保元素宽度包括边框和内边距 */
}

.pagination-1 {
  display: inline-block;
  margin-left: 50px;
}

.update-log {
  background-color: #303133;
  color: white;
  border-color: #303133;
  border-right-color: #1f2124;
}

#chartContainer {
  position: relative;
  margin-top: 25px !important;
  max-width: 100%;
  overflow: hidden;

}

.curve {
  margin-top: 25px;
  margin-bottom: 5px;
  width: 400px;
  height: 300px;
}

.el-card card2 is-always-shadow {
  width: 100px !important;
}

.custom-icon {
  font-weight: 750;
  font-size: 1em;
  margin-left: 5px;
}
</style>
