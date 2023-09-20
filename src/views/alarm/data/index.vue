<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column width="15" align="left" />
      <!--      <el-table-column type="selection" width="55" align="left"/>-->
      <el-table-column label="设备名称" align="left" prop="name" />
      <el-table-column label="网络状态" align="left" prop="netStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_equipment_net_status" :value="scope.row.netStatus" />
        </template>
      </el-table-column>
      <el-table-column label="设备型号 " align="left" prop="type" />
      <el-table-column label="IP" align="left" prop="ip" />
      <el-table-column label="端口" align="left" prop="port" />
      <el-table-column label="备注" align="left" prop="remark" />
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button class="button" size="mini" type="text" icon="el-icon-setting" @click="handlealarm(scope.row)">配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row :gutter="10" class="mb9">
      <el-col :span="1.5">
        <el-button class="button" size="mini" @click="handleEmpt">清空
        </el-button>
      </el-col>
      <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    </el-row>
    <!--    报警信息-->
    <el-table :data="list">
      <el-table-column width="15" align="left" />
      <el-table-column label="设备名称" align="left" prop="equipmentName" />
      <el-table-column label="设备ID" align="left" prop="equipmentId" />
      <el-table-column label="报警类型" align="left" prop="alarmType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_alarm_type" :value="scope.row.alarmType" />
        </template>
      </el-table-column>
      <el-table-column label="报警级别" align="left" prop="alarmLevel">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_alarm_level" :value="scope.row.alarmLevel" />
        </template>
      </el-table-column>
      <el-table-column label="图片" align="left">
        <template slot-scope="scope">
          <img :src="scope.row.relateSnap" v-bind:lazy="true" min-width="65" height="65"
            @click="showPreview = true; previewImage = scope.row.relateSnap" />
        </template>
      </el-table-column>
      <el-table-column label="时间" align="left" prop="createTime" />
    </el-table>


    <!--    配置设备报警信息-->
    <!-- 添加或修改测温报警配置对话框 -->
    <el-dialog class="dialoginfo" :title="title" :visible.sync="open" width="500px" append-to-body>
      <div style="display: flex; justify-content: center">
        <el-tabs type="border-card" style="width: 450px; min-height: 350px; margin-bottom: 0">
          <el-tab-pane label="报警">
            <el-form ref="form" :model="form" label-width="70px" class="tabs">
              <el-form-item label="报警使能" prop="tempAlarmSwitch" style="margin-bottom: 0">
                <el-switch v-model="form.tempAlarmSwitch" :active-value="'1'" :inactive-value="'0'" />
              </el-form-item>
              <el-form-item label="高温报警" prop="highTempAlarmEnable" style="margin-bottom: 0">
                <el-switch v-model="form.highTempAlarmEnable" :active-value="1" :inactive-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="一级" prop="highTempThresholdLevel1" style="display: inline-block; margin-bottom: 0">
                <el-input v-model="form.highTempThresholdLevel1" style="width: 50px" />
              </el-form-item>
              <el-form-item label="二级" prop="highTempThresholdLevel2"
                style="display: inline-block; margin-bottom: 0; margin-left: 10px">
                <el-input v-model="form.highTempThresholdLevel2" style="width: 50px" />
              </el-form-item>
              <el-form-item label="三级" prop="highTempThresholdLevel3" style="display: inline-block;">
                <el-input v-model="form.highTempThresholdLevel3" style="width: 50px" />
              </el-form-item>
              <el-form-item label="低温报警" prop="lowTempAlarmEnable" style="margin-bottom: 0">
                <el-switch v-model="form.lowTempAlarmEnable" :active-value="1" :inactive-value="0">
                </el-switch>
              </el-form-item>
              <el-form-item label="一级" prop="lowTempThresholdLevel1" style="display: inline-block; margin-bottom: 0">
                <el-input v-model="form.lowTempThresholdLevel1" style="width: 50px" />
              </el-form-item>
              <el-form-item label="二级" prop="lowTempThresholdLevel2" style="display: inline-block; margin-bottom: 0">
                <el-input v-model="form.lowTempThresholdLevel2" style="width: 50px" />
              </el-form-item>
              <el-form-item label="三级" prop="lowTempThresholdLevel3" style="display: inline-block; margin-bottom: 0">
                <el-input v-model="form.lowTempThresholdLevel3" style="width: 50px" />
              </el-form-item>
              <el-form-item label="是否抓图" prop="snapEnable" style="margin-bottom: 0">
                <el-switch v-model="form.snapEnable" :active-value="1" :inactive-value="0">
                </el-switch>
              </el-form-item>
              <!--              <el-form-item label="是否通知" style="margin-bottom: 0">-->
              <!--                <el-switch-->
              <!--                  v-model="value2"-->
              <!--                  active-color="#13ce66"-->
              <!--                  inactive-color="#ff4949">-->
              <!--                </el-switch>-->
              <!--              </el-form-item>-->
            </el-form>
          </el-tab-pane>
          <!--              <el-tab-pane label="联动">-->
          <!--              </el-tab-pane>-->
        </el-tabs>
        <!--          </div>-->
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="button" type="primary" @click="submitForm">确定</el-button>
        <el-button class="button" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--    展示预览图片-->
    <div v-if="showPreview" class="image-preview">
      <img :src="previewImage" @click="showPreview = false">
    </div>

  </div>
</template>

<script>
import {
  getData,
  delData,
  addData,
  updateData,
  configData,
  editConfig,
  offData,
  listAlarmToday
} from "@/api/alarm/data";
import { listData } from "@/api/equipment/data";

export default {
  name: "Data",
  dicts: ['the_alarm_level', 'the_alarm_type', 'the_equipment_net_status'],   //字典用法
  data() {
    return {
      //报警图片预览
      showPreview: false,
      previewImage: '',
      webSockets: [],
      message: "",
      redata: "",
      ws: null,
      list: [],
      tempSwitch: false,
      equipmentConfigId: 0,
      allIds: [],
      num: 5,
      value1: true,
      value2: true,
      netStatus: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 报警设备表格数据
      dataList: [],
      //报警信息数据
      alarmForm: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 联动录像路径时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        equipmentId: null,
        equipmentName: null,
        tempRegionId: null,
        tempRegionName: null,
        alarmLevel: null,
        alarmType: null
      },
      // 表单参数
      form: {},
      formFlag: true,
    };
  },
  created() {
    this.startTask();
    this.getList();
  },

  beforeDestroy() {
    this.socketClose();
  },

  methods: {

    /** 查询报警中心列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      })
    },
    // 查询当天报警信息
    todayAlarmList() {
      this.loading = true
      listAlarmToday().then(res => {
        this.list = res.data
        this.total = res.total;
        console.log(this.list)
        this.loading = false;
      })
    },

    startTask() {
      this.loading = true;
      //查询所有的设备，过滤不在线的设别，
      listData()
        .then(response => {
          this.dataList = response.rows;
          if (this.dataList !== null) {
            this.allIds = this.dataList.filter(item => item.netStatus === "1").map(item => item.id);
            const promises = this.allIds.map(id =>
              configData(id).then(response => {
                if (response.data !== null && response.data !== undefined) {
                  //当返回了一个alarmConfig对象时
                  const config = response.data;
                  //标记为已经开启了温度检测定时任务
                  this.tempSwitch = true;
                  return offData(config.equipmentId)
                    .then(() => editConfig(config))
                    .then(() => id);
                } else {
                  //否则手动创建一个promise对象返回
                  return Promise.resolve(id);
                }
              }).catch(error => {
                throw error; // 抛出错误以中断 Promise 链
              })
            );
            return Promise.all(promises)
              .then(ids => {
                const filteredIds = ids.filter(id => id !== undefined);
                return Promise.all(filteredIds.map(id => this.initWebSocket(id)));
              })
              .then(() => {
                this.tempSwitch = true;
              })
              .catch(error => {
                throw error; // 抛出错误以中断 Promise 链
              })
              .finally(() => {
                this.loading = false;
              });
          }
          this.total = response.total;
        })
        .catch(error => {
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {};
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
      console.info(this.ids);
    },

    handlealarm(row) {
      this.reset();
      const equipmentId = row.id || this.ids
      this.equipmentConfigId = equipmentId
      this.form.equipmentId = row.id
      this.form.equipmentName = row.name
      this.form.regionName = row.groupName;
      if (row.netStatus != 0) {
        configData(equipmentId).then(response => {
          if (response.data == null) {
            this.open = true;
            this.title = "报警配置";
          } else {
            this.form = response.data;
            this.open = true;
            this.title = "报警配置";
          }
        })
      } else {
        this.open = false
        this.$modal.msgError("设备已离线");
      }

    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.tempSwitch == true) {
            //删除参数
            offData(this.equipmentConfigId).then(res => {
              this.open = false;
            })
          }
          editConfig(this.form).then(response => {
            this.$modal.msgSuccess("修改成功");
            this.open = false;
            this.tempSwitch = true;
            this.getList();
          });
        }
      });
    },
    // 定义websocket来操作
    initWebSocket(id) {
      if ('WebSocket' in window) {
        let host = window.location.hostname
        let socketUrl = "ws://" + host + ":8080/websocket/" + id
        const webSocket = new WebSocket(socketUrl); // 新建一个webSocket对象
        this.webSockets.push(webSocket) //将新建的webSocket存入集合中
        webSocket.onopen = this.webSocketOnOpen
        webSocket.onmessage = this.webSocketOnMessage
        webSocket.onerror = this.webSocketOnError
        webSocket.onclose = this.webSocketOnClose
      } else {
        this.$message.error('当前浏览器不支持 websocket')
      }
    },
    webSocketOnOpen() {
      this.heartbeatTimer = setInterval(() => {
        this.websocketsend('PING')
      }, 30 * 1000) // 30 秒发一次心跳包
    },
    webSocketOnError() {
    },
    webSocketOnMessage(e) {
      this.redata = JSON.parse(e.data)
      this.list.push(this.redata)
      this.list.sort(this.sortData);
    },
    sortData(a, b) {
      return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    },
    websocketsend(Data) {
      this.webSockets.forEach((item) => {
        if (item != null) {
          item.send(Data)
        }
      })
    },
    webSocketOnClose() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer) //清除定时器
      }
    },
    socketClose() {
      this.webSockets.forEach((item) => {
        if (item != null) {
          item.close()
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除报警中心编号为"' + ids + '"的数据项？').then(function () {
        return delData(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    //清空按钮
    handleEmpt() {
      this.list = [];
    }
  }
};
</script>
<style>
.el-table .fixed-width .el-button--mini {
  font-weight: 550;
  font-size: .85em;
}

.el-form-item__label {
  font-weight: 550;
  font-size: .9em;
  color: #dadada;

}

.el-switch__core {
  border: 1px solid #303133;
  background: #303133;
}

.el-switch__core:after {
  border-color: #5e6493;
  background: #5e6493;
}

.el-switch.is-checked .el-switch__core {
  border-color: #2c2832;
  background-color: #2c2832;
}

/*.el-button {*/
/*  color: #dadada !important;*/
/*  background-color: #303133 !important;*/
/*  border-color: #303133 !important;*/
/*  font-weight: 700;*/
/*  font-size: .85em;*/
/*}*/

.button {
  color: #dadada !important;
  background-color: #303133 !important;
  border-color: #303133 !important;
  font-weight: 700 !important;
  font-size: .85em !important;
}


/*
按钮悬浮
*/
.el-button:hover {
  border-color: #303133;
}

/*
  按钮点击
  */
.el-button:focus {
  background-color: #2c2832 !important;
  border-color: #2c2832 !important;
  color: #5e6493 !important;
}

.el-input__inner {
  padding-left: 5px;
  background-color: #303133;
  border: 1px solid #303133;
  color: #dadada;
}

/*
  点击之后边框的高亮颜色改变
  */
.el-input__inner:focus {
  border: 1px solid #303133;
}

.el-input__inner:hover {
  border: 1px solid #303133;
}

.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: #2c2832 !important;
}

.el-table::before {
  background: #2b2f3a;
}

.el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #151517;
  border: 1px solid #181a1d;
}

.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #151517;
  border-color: #151517;
}

.el-message-box {
  background: #1f2124;
  color: #dadada;
  border: solid 1px #1f2124;
}

.el-message-box__title {
  color: #dadada;
}

.el-message-box__message p {
  color: #dadada;
}

.el-message-box__status.el-icon-warning {
  color: #5e6493;
}

.el-tag.el-tag--success {
  background-color: #303133;
  border-color: #303133;
  color: #13ce66;
  font-weight: 500;
  font-size: 0.95em;
}

.el-tag.el-tag--warning {
  background-color: #303133;
  border-color: #303133;
  color: #dadada;
  font-weight: 500;
  font-size: 0.95em;
}

.el-tag.el-tag--danger {
  background-color: #303133;
  border-color: #303133;
  color: #e66a75;
  font-weight: 500;
  font-size: 0.95em;
}

.el-pagination__total {
  font-size: .85em;
  font-weight: 550;
  color: #dadada;
}

.el-pagination__sizes .el-input .el-input__inner {
  font-size: 1em;
  font-weight: 550;
  color: #dadada;
}

.el-pagination.is-background .btn-prev:disabled,
.el-pagination.is-background .btn-next:disabled {
  color: #dadada;
  background: #303133;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #2c2832;
  color: #5e6493;
}

.image-preview {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
}

.image-preview img {
  max-height: 80vh;
  max-width: 80vw;
  cursor: pointer;
}
</style>
