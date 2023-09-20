<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="left"/>-->
      <el-table-column width="15" align="left"/>
      <el-table-column label="设备名称" align="left" prop="name"/>
      <el-table-column label="网络状态" align="left" prop="netStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_equipment_net_status" :value="scope.row.netStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="设备型号 " align="left" prop="type"/>
      <el-table-column label="IP" align="left" prop="ip"/>
      <el-table-column label="端口" align="left" prop="port"/>
      <el-table-column label="备注" align="left" prop="remark"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            class="temBtn"
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handlealarm(scope.row)"
          >配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    测温-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="75px"
             style="margin-top: 60px;">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="temBtn" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="tempList">
      <!--      <el-table-column type="selection" width="55" align="left"/>-->
      <el-table-column width="15" align="left"/>
      <!--      <el-table-column label="ID" align="center" prop="id" />-->
      <el-table-column label="设备ID" align="left" prop="equipmentId"/>
      <el-table-column label="设备名称" align="left" prop="equipmentName"/>
      <el-table-column label="IP" align="left" prop="equipment.ip"/>
      <el-table-column label="最高温度" align="left" prop="tempMax"/>
      <el-table-column label="最低温度" align="left" prop="tempMin"/>
      <el-table-column label="平均温度" align="left" prop="tempAvg"/>

      <el-table-column label="是否正常" align="left" prop="normal">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal" :value="scope.row.normal"/>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="left" prop="createTime" width="180">
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="paramList"
    />

    <!--    配置-->
    <el-dialog :title="title" :visible.sync="open"
               @closed="handleDialogClosed"
               :beforeDestroy="handleDialogBeforeDestroy"
               width="780px">
      <el-row style="margin-top: 5px; margin-left: 10px">
        <el-col :xs="24" :sm="24" :md="12" :lg="4">
          <div style="height: 300px; width: 400px">
            <video muted="muted" autoplay="autoplay" ref="videoElement"
                   style="margin-top: 5px; width: 100% ; height: 100%">
            </video>
          </div>
        </el-col>
        <el-form ref="osdForm" :model="osdForm" :rules="rules">
          <el-col :xs="24" :sm="24" :md="12" :lg="8" style="margin-left: 360px">
            <el-row style="height: 48px;">
              <el-col>
                <el-form-item label="OSD全局测温" prop="osdTemp">
                  <el-switch
                    v-model="osdForm.osdTemp"
                    :active-value="true"
                    :inactive-value="false"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="OSD环境参数" prop="osdEnvir">
                  <el-switch
                    v-model="osdForm.osdEnvir"
                    :active-value="true"
                    :inactive-value="false"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="OSD伪彩条叠加" prop="osdPseudo">
                  <el-switch
                    v-model="osdForm.osdPseudo"
                    :active-value="true"
                    :inactive-value="false"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col>
                <el-form-item label="OSD高低温光标" prop="osdMaxMinCursor">
                  <el-switch
                    v-model="osdForm.osdMaxMinCursor"
                    :active-value="true"
                    :inactive-value="false"
                  >
                  </el-switch>
                </el-form-item>
              </el-col>

            </el-row>
          </el-col>
        </el-form>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getData, delData, addData, updateData, tempData} from "@/api/temp/data";
  import {
    configData,
    configDataByEquip,
    listData,
    osdData,
    osdDataSwitch,
    osdParamData,
    osdParamDataByData
  } from "@/api/equipment/data";
  import Wfs from "../../../api/mwfs";

  export default {
    name: "Data",
    dicts: ['the_alarm_level', 'the_alarm_type', 'the_equipment_net_status', 'sys_normal'],
    data() {
      return {
        wfs: null, // 保存当前激活的 Wfs 实例
        videoRef: null,
        configEquipmentId: 0,
        configEquipmentName: "",
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        netStatus: null,
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        //当前所在页默认是第一页
        currentPage: 1,
        pageSize: 10,  //每页显示多少行数据 默认设置为10
        pageTicket: [],//分页后的当前页数据
        // 设备列表
        dataList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 最低温Y轴坐标时间范围
        daterangeCreateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          createBy: null,
          createTime: null,
          equipmentName: null,
          beginTime: null,
          endTime: null,
          tempRegionName: null
        },
        // 表单参数
        osdForm: {},
        //  测温数据
        tempList: [],
        rules: {
          osdTemp: [
            {required: true, message: "请选择全局测温", trigger: 'blur'}
          ],
          osdEnvir: [
            {required: true, message: "请选择环境参数", trigger: 'blur'}
          ],
          osdPseudo: [
            {required: true, message: "请选择伪彩叠加", trigger: 'blur'}
          ],
          osdMaxMinCursor: [
            {required: true, message: "请选择温度光标", trigger: 'blur'}
          ]
        }

      };
    },
    created() {
      this.getList();
    },

    async mounted() {
      await this.$nextTick();
      this.videoRef = null;
      const {id: configEquipmentId} = this.currentEquipment || {};
      this.wfs = new Wfs();
      this.wfs.attachMedia(this.videoRef, configEquipmentId);
    },

    methods: {

      handleDialogClosed() {
        if (this.wfs) {
          this.wfs.destroy();
          this.wfs = null;
        }
      },
      //在关闭dialog之前释放视频资源
      handleDialogBeforeDestroy() {
        if (this.wfs) {
          this.wfs.destroy();
          this.wfs = null;
        }
      },
      /** 查询测温数据列表 */
      getList() {
        this.loading = true;
        listData(null).then(response => {
          this.dataList = response.rows;
          // this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
      },

      paramList() {
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.beginTime = this.daterangeCreateTime[0];
          this.queryParams.endTime = this.daterangeCreateTime[1];
        }
        // console.log(this.queryParams)
        tempData(this.queryParams).then(response => {
          // console.log(response.rows)
          this.tempList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.paramList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },

      async handlealarm(row) {
        if (Wfs.isSupported()) {
          // this.open = true;
          // this.title = "测温配置"
          this.configEquipmentId = row.id;
          this.configEquipmentName = row.name
          const equipmentId = row.id || this.ids
          if (row.netStatus != 0) {
            //先查数据库
            osdParamDataByData(equipmentId)
              .then(response => {
                if (response.data != null) {
                  // 不为空直接赋值
                  this.osdForm = response.data;
                } else {
                  // 如果返回数据为空，则从设备
                  return osdParamData(equipmentId);
                }
              })
              .then(response => {
                if (response && response.data != null) {
                  // 获取到数据后赋值
                  this.osdForm = response.data;
                }
              })
              .catch(error => {
                // 处理错误情况
                console.error(error);
              });
            this.open = true;
            this.title = "测温配置"

            // 添加延迟以确保视频对象已经加载并准备好了
            await new Promise(async resolve => { // 将 Promise 函数添加 async 关键字标识
              this.$nextTick(() => {
                this.videoRef = this.$refs['videoElement'];
                if (this.videoRef) { // 添加 videoRef 的判断
                  this.wfs = new Wfs();
                  this.wfs.attachMedia(this.videoRef, this.configEquipmentId);
                }
                //  视频流延迟
                setInterval(() => {
                  if (this.videoRef.buffered.length) {
                    let end = this.videoRef.buffered.end(0);
                    let diff = end - this.videoRef.currentTime;
                    if (diff >= 0.5) {
                      this.videoRef.currentTime = this.videoRef.buffered.end(0)
                    }
                  }
                }, 500)
                resolve();
              });
            })
          } else {
            this.$modal.msgError("设备已离线")
          }
        }
      },

      /** 提交按钮 */
      submitForm() {
        this.$refs["osdForm"].validate(valid => {
          if (valid) {
            this.osdForm.equipmentId = this.configEquipmentId
            this.osdForm.equipmentName = this.configEquipmentName
            osdDataSwitch(this.osdForm).then(response => {
              this.$modal.msgSuccess("配置成功");
              this.open = false;
              this.getList();
            });
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$modal.confirm('是否确认删除测温数据编号为"' + ids + '"的数据项？').then(function () {
          return delData(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('temp/data/export', {
          ...this.queryParams
        }, `data_${new Date().getTime()}.xlsx`)
      }
    },

  };
</script>
<style>


  .el-dialog__header {
    padding: 20px;
    background: #1f2124;
    /* padding-bottom: 10px; */
  }

  .el-dialog__body {
    padding: 20px;
    background: #1f2124;
    color: #dadada;

    /* padding-bottom: 10px; */
  }

  .el-dialog__footer {
    padding: 20px;
    padding-top: 10px;
    text-align: right;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #1f2124;
  }


  /*.el-dialog__title {*/
  /*  line-height: 24px;*/
  /*  font-size: 18px;*/
  /*  color: #dadada;*/
  /*}*/

  .el-form-item__label {
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

  .el-button {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
  }

  .temBtn {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
    font-weight: 700;
    font-size: .85em;
  }

  /*日期按钮*/
  .el-button--text {
    color: #dadada;
    background-color: #303133 !important;
    border-color: #303133 !important;
    padding-left: 0;
    padding-right: 0;
    width: 50px;
  }

  .el-table .fixed-width .el-button--mini {
    font-weight: 550;
    font-size: .85em;
  }

  /*
  按钮悬浮
  */
  .el-button:hover {
    color: #dadada;
    background-color: #303133;
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

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #2c2832 !important;
  }

  .el-table::before {
    background: #2b2f3a;
  }

  .el-range-editor .el-range-input {
    background: #303133;
    color: #dadada;
    border-color: #303133;
  }

  .el-range-editor .el-range-input:focus {
    border-color: #303133 !important;
  }

  .el-range-editor.is-active:hover {
    border-color: #303133 !important;
  }

  .el-input__inner {
    background: #303133;
    color: #dadada;
    border-color: #303133;
  }

  .el-input__inner:focus {
    border-color: #303133;
  }

  .el-input__inner:hover {
    border-color: #303133;
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
    color: #e66a75;
    font-weight: 500;
    font-size: 0.95em;
  }

  .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
    margin: 0 5px;
    background-color: #303133;
    color: #dadada;
    min-width: 30px;
    border-radius: 2px;
  }

  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(44, 40, 50);
    border-color: rgb(44, 40, 50);
    color: #5e6493;
  }

  .el-pagination__jump {
    margin-left: 20px;
    font-weight: normal;
    color: #dadada;
  }

  .el-pagination.is-background .el-pager li:not(.disabled):hover {
    background-color: rgb(44, 40, 50);
    border-color: rgb(44, 40, 50);
    color: #5e6493;
  }

  .el-pagination__sizes .el-input .el-input__inner:hover {
    border-color: #5e6493;
  }

</style>
