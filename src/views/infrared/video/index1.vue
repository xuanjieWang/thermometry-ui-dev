<template>
  <div class="app-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center; background-color: #303133; color: white;">
          <span>线上在运行红外相机数<br>{{ equipmentTempList[0].onlineE }}台</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center; background-color: #303133; color: white;">
          <span>离线红外相机<br>{{ equipmentTempList[0].offlineE }}台</span><br>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center;background-color: #303133; color: white;">
          <span>故障红外相机<br>{{ equipmentTempList[0].badE }}台</span><br>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center; background-color: #303133; color: white;">
          <span>当天超温低温报警件数<br>{{ equipmentTempList[0].alarmNumTotalToday }}件</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center; background-color: #303133; color: white;">
          <span>累计报警总数<br>{{ equipmentTempList[0].alarmNumTotal }}件</span><br>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="4">
        <el-card class="update-log" style="text-align: center; background-color: #303133; color: white;">
          <span>红外相机总设备数<br>{{ equipmentTempList[0].etotal }}台</span><br>
        </el-card>
      </el-col>
    </el-row>

    <!--    <el-row>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="4">-->
    <!--        &lt;!&ndash;        <el-card class="update-log" style="text-align: center;background-color: #303133; color: white;height: 48px;" >&ndash;&gt;-->
    <!--        <el-card class="update-log">-->
    <!--          <el-row style="text-align: center; margin-bottom: 40px">实时温度信息</el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前相机精确位置:东南区域</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最低温度:{{ minT1 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最高温度:{{ maxT1 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表平均温度:{{ avgT1 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
    <!--        <div style="height: 296px; width: 489px">-->
    <!--          <video id="video1" height="285" width="600" muted="muted" autoplay="autoplay"></video>-->
    <!--        </div>-->
    <!--      </el-col>-->

    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="4">-->
    <!--        <el-card class="update-log">-->
    <!--          <el-row style="text-align: center; margin-bottom: 40px">实时温度信息</el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前相机精确位置:东北区域</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最低温度:{{ minT2 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最高温度:{{ maxT2 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表平均温度:{{ avgT2 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
    <!--        <div style="height: 296px; width: 489px">-->
    <!--          <video id="video2" height="285" width="400" muted="muted" autoplay="autoplay"></video>-->
    <!--        </div>-->
    <!--        &lt;!&ndash;        <el-card class="update-log" style="text-align: center;height: 289px;">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <h1 style="line-height: 200px;">东北-相机实时通道2</h1>&ndash;&gt;-->
    <!--        &lt;!&ndash;        </el-card>&ndash;&gt;-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <el-row style="margin-bottom: 10px;">
      <template v-for="(item, index) in equipmentTempList">
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <el-card class="update-log">
            <el-row style="text-align: center; margin-bottom: 40px">实时温度信息</el-row>
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
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8">
          <div style="height: 296px; width: 489px">
            <video :ref="'videoRef_' + index" :id="'video_' + index" height="285" width="400" muted="muted"
                   autoplay="autoplay"></video>
          </div>
        </el-col>
      </template>
    </el-row>
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="8" v-for="(item,i) in equipmentTempList" >-->
    <!--        <div style="height: 296px; width: 489px">-->
    <!--          <video :ref="'videoRef_' + i" :id="'video_' + i" height="285" width="400" muted="muted"-->
    <!--                 autoplay="autoplay"></video>-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
    <!--        &lt;!&ndash;        <el-card class="update-log" style="text-align: center;height: 289px;">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <h1 style="line-height: 200px;">西南-相机实时通道3</h1>&ndash;&gt;-->
    <!--        &lt;!&ndash;        </el-card>&ndash;&gt;-->

    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="4">-->
    <!--        <el-card class="update-log">-->
    <!--          <el-row style="text-align: center; margin-bottom: 40px">实时温度信息</el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前相机精确位置:西南区域</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最低温度:{{ minT3 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表最高温度:{{ maxT3 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--          <el-row style="height: 48px;">-->
    <!--            <el-col><span>当前外表平均温度:{{ avgT3 }}℃</span></el-col>-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--      </el-col>-->
    <!--      <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
    <!--        &lt;!&ndash;        <el-card class="update-log" style="text-align: center;height: 289px;">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <h1 style="line-height: 200px;">西南-相机实时通道3</h1>&ndash;&gt;-->
    <!--        &lt;!&ndash;        </el-card>&ndash;&gt;-->
    <!--        <div style="height: 296px; width: 489px">-->
    <!--          <video id="video3" height="285" width="400" muted="muted" autoplay="autoplay"></video>-->
    <!--        </div>-->
    <!--      </el-col>-->

    <!--            <el-col :xs="24" :sm="24" :md="12" :lg="4">-->
    <!--              <el-card class="update-log">-->
    <!--                <el-row style="text-align: center; margin-bottom: 40px">实时温度信息</el-row>-->
    <!--                <el-row style="height: 48px;">-->
    <!--                  <el-col><span>当前相机精确位置:西北区域</span></el-col>-->
    <!--                </el-row>-->
    <!--                <el-row style="height: 48px;">-->
    <!--                  <el-col><span>当前外表最低温度:{{ minT4 }}℃</span></el-col>-->
    <!--                </el-row>-->
    <!--                <el-row style="height: 48px;">-->
    <!--                  <el-col><span>当前外表最高温度:{{ maxT4 }}℃</span></el-col>-->
    <!--                </el-row>-->
    <!--                <el-row style="height: 48px;">-->
    <!--                  <el-col><span>当前外表平均温度:{{ avgT4 }}℃</span></el-col>-->
    <!--                </el-row>-->
    <!--              </el-card>-->
    <!--            </el-col>-->
    <!--            <el-col :xs="24" :sm="24" :md="12" :lg="8">-->
    <!--              &lt;!&ndash;        <el-card class="update-log" style="text-align: center;height: 289px;">&ndash;&gt;-->
    <!--              &lt;!&ndash;          <h1 style="line-height: 200px;">西北-相机实时通道4</h1>&ndash;&gt;-->
    <!--              &lt;!&ndash;        </el-card>&ndash;&gt;-->
    <!--              <div style="height: 296px; width: 489px">-->
    <!--                <video id="video4" height="285" width="400" muted="muted" autoplay="autoplay"></video>-->
    <!--              </div>-->

    <!--            </el-col>-->
    <!--    </el-row>-->

    <!--    <el-form size="small" :inline="true" v-show="showSearch">-->
    <!--      <el-form-item label="时间">-->
    <!--        <el-date-picker-->
    <!--          v-model="dateRange"-->
    <!--          style="width: 240px"-->
    <!--          value-format="yyyy-MM-dd"-->
    <!--          type="daterange"-->
    <!--          range-separator="-"-->
    <!--          start-placeholder="开始日期"-->
    <!--          end-placeholder="结束日期"-->
    <!--        ></el-date-picker>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="故障类型">-->
    <!--        <el-select-->
    <!--          v-model="selected"-->
    <!--          placeholder="全部故障"-->
    <!--          style="width: 240px"-->
    <!--        >-->
    <!--          <el-option value="全部故障">全部故障</el-option>-->
    <!--          <el-option value="过温故障">过温故障</el-option>-->
    <!--          <el-option value="欠温故障">欠温故障</el-option>-->
    <!--          <el-option value="设备故障">设备故障</el-option>-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item label="区域">-->
    <!--        <el-select-->
    <!--          v-model="selected2"-->
    <!--          placeholder="全部区域"-->
    <!--          style="width: 240px"-->
    <!--        >-->
    <!--          <el-option value="全部区域">全部故障</el-option>-->
    <!--          <el-option value="东南区域">东南区域</el-option>-->
    <!--          <el-option value="西北区域">西北区域</el-option>-->
    <!--          <el-option value="西南区域">西南区域</el-option>-->
    <!--          <el-option value="东北区域">东北区域</el-option>-->
    <!--        </el-select>-->
    <!--      </el-form-item>-->
    <!--      <el-form-item>-->
    <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
    <!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
    <!--        &lt;!&ndash;        <pagination&ndash;&gt;-->
    <!--        &lt;!&ndash;      v-show="total>0"&ndash;&gt;-->
    <!--        &lt;!&ndash;      :total="total"&ndash;&gt;-->
    <!--        &lt;!&ndash;      :page.sync="queryParams.pageNum"&ndash;&gt;-->
    <!--        &lt;!&ndash;      :limit.sync="queryParams.pageSize"&ndash;&gt;-->
    <!--        &lt;!&ndash;      @pagination="getList()"&ndash;&gt;-->
    <!--        &lt;!&ndash;    />&ndash;&gt;-->
    <!--      </el-form-item>-->
    <!--      &lt;!&ndash;      <el-form-itme>&ndash;&gt;-->
    <!--      &lt;!&ndash;        <div class="pagination-1">&ndash;&gt;-->
    <!--      &lt;!&ndash;          <el-pagination&ndash;&gt;-->
    <!--      &lt;!&ndash;            background&ndash;&gt;-->
    <!--      &lt;!&ndash;            :current-page="tablePage.pageNum"&ndash;&gt;-->
    <!--      &lt;!&ndash;            :page-size="tablePage.pageSize"&ndash;&gt;-->
    <!--      &lt;!&ndash;            :total="tablePage.total"&ndash;&gt;-->
    <!--      &lt;!&ndash;            @size-change="handleSizeChange"&ndash;&gt;-->
    <!--      &lt;!&ndash;            @current-change="handlePageChange"&ndash;&gt;-->
    <!--      &lt;!&ndash;            @pagination="getList()"&ndash;&gt;-->
    <!--      &lt;!&ndash;          />&ndash;&gt;-->
    <!--      &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;      </el-form-itme>&ndash;&gt;-->
    <!--    </el-form>-->
    <!--    <el-table :data="alarmList">-->
    <!--      <el-table-column label="序号" prop="alarmId" align="center" width="120" />-->
    <!--      <el-table-column label="报警区域" prop="alarmArea" align="center" width="180" />-->
    <!--      <el-table-column label="报警类型" prop="alarmType" align="center" width="180" />-->
    <!--      <el-table-column label="报警内容" prop="alarmContent" align="center" width="180" />-->
    <!--      <el-table-column label="报警图片" prop="alarmImg" align="center" :show-overflow-tooltip="true" width="180">-->
    <!--        &lt;!&ndash; <template slot-scope="scope">-->
    <!--          <el-image :src="scope.row.alarmImg"/>-->
    <!--        </template> &ndash;&gt;-->
    <!--        <template scope="scope">-->
    <!--        <el-popover placement="right" title="" trigger="click">-->
    <!--            <el-image slot="reference" :src="scope.row.alarmImg" :alt="scope.row.alarmImg" style="max-height: 200px;max-width: 200px;width: 50px; height: 50px"></el-image>-->
    <!--            <el-image :src="scope.row.alarmImg" ></el-image>-->
    <!--        </el-popover>-->
    <!--    </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="报警时间" align="center" prop="alarmTime" width="180">-->
    <!--        <template slot-scope="scope">-->
    <!--          <span>{{ parseTime(scope.row.alarmTime) }}</span>-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="相机设备id" prop="cameraId" align="center" width="180" />-->
    <!--      <el-table-column label="相机通道地址" prop="cameraAddr" align="center" width="180" />-->
    <!--      <el-table-column label="备注" prop="alarmNote" align="center" class-name="small-padding fixed-width" />-->
    <!--    </el-table>-->
  </div>
</template>

<script setup lang="js">
import Wfs from '../../../api/mwfs.js'
import {EquipData, EquipTemp} from "@/api/equipment/data";
import axios from "axios";

export default {
  name: "Video",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      index: 0,
      minT1: '-2',
      minT2: '-2',
      minT3: '-2',
      minT4: '-2',
      maxT1: '20',
      maxT2: '20',
      maxT3: '20',
      maxT4: '20',
      avgT1: '20',
      avgT2: '20',
      avgT3: '20',
      avgT4: '20',
      selected: '',
      selected2: '',
      alarmList: [{
        alarmId: '1',
        alarmArea: '东南区域',
        alarmType: '超低温',
        alarmContent: '东北吸热塔外表温度超出高温闻值',
        // alarmImg: 'https://a1.cdn.91360.com/cms/bs3/upload/section/31c9f4a94769e924b7ccd764c075b29a_t.png',
        alarmImg: '/img/southeast.png',
        alarmTime: '2022-03-27 19:20:03',
        cameraId: '设备001',
        cameraAddr: '192.168.10.12',
        alarmNote: ''
      }],
      // {
      //   alarmId: '2',
      //   alarmArea: '西北区域',
      //   alarmType: '超高温',
      //   alarmContent: '西南温度吸热塔外表温度低于低温阙值',
      //   alarmImg: '/img/northwest.png',
      //   alarmTime: '2022-03-27 19:20:03',
      //   cameraId: '设备002',
      //   cameraAddr: '192.168.10.12',
      //   alarmNote: ''
      // }],

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
      timerId:'',
      //视屏存储
      videos:[]
    };
  },
  beforeDestroy() {
    clearInterval(this.timerId);
    // 取消所有未完成的请求
    this.cancelTokens.forEach(cancelToken => cancelToken.cancel());
    this.videos.forEach(wfs =>wfs.destroy())
  },
  mounted() {
    this.mwfs();
    //保证获取最新的DOM元素
    this.$nextTick(() => {
      const timerId =setInterval(() => {
        this.getTemp();
      }, 2000);
      // 将定时器 ID 存储到组件实例属性中，
      // 在组件销毁前清除定时器
      this.timerId = timerId;
    });
  },

  methods: {
    getTemp() {
      if (this.isFetching) {
        return;
      }
      //先取消所有未完成的请求
      this.cancelTokens.forEach(cancelToken => cancelToken.cancel());
      this.cancelTokens = [];

      this.isFetching = true;

      const requests = this.equipmentList.map((item, index) => {
        const cancelToken = axios.CancelToken.source();
        this.cancelTokens.push(cancelToken);

        return EquipTemp(item, {cancelToken: cancelToken.token}).then(res => {
          this.$set(this.equipmentTempList, index, res.data);
        });
      });

      Promise.all(requests)
        .finally(() => {
          this.isFetching = false;
        });
    },

    async mwfs() {
      // Wfs 对象已经存在，可以进行后续操作
      if (Wfs.isSupported()) {
        // 循环遍历设备列表
        //发送请求获取当前设备列表
        this.equipmentList = await this.getEquipmentTemp()
        for (let i = 0; i < this.equipmentList.length; i++) {
          const item = this.equipmentList[i];
          // // 发送同步请求获取当前温度信息
          // const res = await EquipTemp(item);
          // this.equipmentTempList.push(res.data)
          // 使用异步操作加载视频源
          await new Promise(async resolve => { // 将 Promise 函数添加 async 关键字标识
            //保证获取最新的DOM元素
            this.$nextTick(() => {
              console.log(i)
              const videoRef = this.$refs[`videoRef_${i}`][0];
              console.log(videoRef)
              const wfs = new Wfs();
              wfs.attachMedia(videoRef, item.id);
              this.videos.push(wfs)
              wfs.on(Wfs.Events.MEDIA_ATTACHED, () => {
                videoRef.play();
                resolve();
              });
            });
          });
        }
      }
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.selected = [];
      this.selected2 = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleDataScope":
          this.handleDataScope(row);
          break;
        case "handleAuthUser":
          this.handleAuthUser(row);
          break;
        default:
          break;
      }
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true : false;
      }
    },
  }
};
</script>

<style>
.pagination-1 {
  display: inline-block;
  margin-left: 50px;
}

.update-log {
  background-color: #303133;
  color: white;
  border-color: #303133;
}

video {
  width: 100%;
  height: 98%;
  object-fit: fill;
}
</style>
