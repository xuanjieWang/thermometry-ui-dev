<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          icon="el-icon-plus"
          class="button"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:data:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          icon="el-icon-delete"-->
      <!--          class="button"-->
      <!--          size="mini"-->
      <!--          @click="handleDelete"-->
      <!--          v-hasPermi="['equipment:data:remove']"-->
      <!--        >删除</el-button>-->
      <!--      </el-col>-->
    </el-row>
    <el-table :data="dataList" style="margin-bottom: 0" v-loading="loading">
      <el-table-column width="15" align="left"/>
      <el-table-column label="ID" align="left" prop="id" width="45"/>
      <!--    <el-table-column label="所属分组ID" align="center" prop="groupId" />-->
      <el-table-column label="设备名称" align="left" prop="name"/>
      <el-table-column label="网络状态" align="left" prop="netStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_equipment_net_status" :value="scope.row.netStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="设备型号 " align="left" prop="type"/>
      <!--            <el-table-column label="分组" align="center" prop="groupName" />-->
      <el-table-column label="IP" align="left" prop="ip"/>
      <el-table-column label="端口" align="left" prop="port"/>
      <el-table-column label="信道" align="left" prop="channel"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div class="button-group">
            <el-button
              class="button"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['equipment:data:edit']"
            >编辑
            </el-button>
            <el-button
              v-if="!isLoading"
              class="button"
              size="mini"
              type="text"
              icon="el-icon-setting"
              :loading="isLoading"
              @click="configEquip(scope.row)"
            >
             配置
            </el-button>

            <el-button
              v-else
              class="button"
              size="mini"
              type="text"
              icon="el-icon-setting"
              :loading="isLoading"
            >
             配置
            </el-button>
            <el-button
              class="button"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['equipment:data:remove']"
            >删除
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row :gutter="10" class="mb9">
      <el-col :span="1.5">
        <el-button
          class="button"
          icon="el-icon-search"
          size="mini"
          @click="queryEquiment"
        >搜索
        </el-button>
      </el-col>

    </el-row>
    <el-table :data="eqList" v-loading="findLoading">
      <el-table-column width="15" align="left"/>
      <el-table-column label="设备名称" align="left" prop="name"/>
      <el-table-column label="IP" align="left" prop="ip"/>
      <el-table-column label="端口" align="left" prop="port"/>
      <el-table-column label="型号 " align="left" prop="type"/>
      <el-table-column label="信道" align="left" prop="channel"/>
      <el-table-column label="操作" align="left" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            class="button"
            icon="el-icon-plus"
            type="text"
            size="mini"
            @click="addEquipment(scope.row)"
            v-hasPermi="['equipment:data:add']"
          >添加
          </el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改设备数据对话框 -->
    <el-dialog class="header" :title="title" :visible.sync="addEquipopen" width="600px">
      <el-form ref="form" :model="form" :rules="rules1" label-width="100px">
        <!--        <el-form-item label="分组" prop="groupId">-->
        <!--          <treeselect v-model="form.groupId"  :options="groupOptions" :normalizer="normalizer" @select="selectTree"  placeholder="请选择父分组ID" />-->
        <!--        </el-form-item>-->
        <el-form-item label="设备名称" prop="name" align="left">
          <el-input v-model="form.name" placeholder="请输入设备名称"/>
        </el-form-item>
        <el-form-item label="网络状态" prop="netStatus" align="left">
          <el-radio-group v-model="form.netStatus">
            <el-radio
              v-for="dict in dict.type.the_equipment_net_status"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="相机位置 " prop="groupName" align="left">
          <el-input v-model="form.groupName" placeholder="请输入相机位置 "/>
        </el-form-item>
        <el-form-item label="设备IP" prop="ip" align="left">
          <el-input v-model="form.ip" placeholder="请输入设备IP地址"/>
        </el-form-item>
        <el-form-item label="信道" prop="channel" align="left">
          <el-input @input="filterChannel" oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="form.channel"
                    placeholder="0、1、2"/>
        </el-form-item>
        <el-form-item label="端口" prop="port" align="left">
          <el-input v-model="form.port" placeholder="请输入端口"/>
        </el-form-item>
        <el-form-item label="设备账号" prop="username" align="left">
          <el-input v-model="form.username" placeholder="请输入登录设备用户名"/>
        </el-form-item>
        <el-form-item label="设备密码" prop="password" align="left">
          <el-input v-model="form.password" show-password placeholder="请输入登录设备密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button" type="primary" @click="submit()">确 定</el-button>
        <el-button class="button" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    认证搜索设备弹框-->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="loginform" :model="loginform" :rules="rules2">
        <el-form-item label="端口" prop="port">
          <el-input v-model="loginform.port" placeholder="请输入端口号"/>
        </el-form-item>
        <el-form-item label="设备账号" prop="username">
          <el-input v-model="loginform.username" placeholder="请输入设备用户名"/>
        </el-form-item>
        <el-form-item label="设备密码" prop="password">
          <el-input v-model="loginform.password" show-password placeholder="请输入设备密码"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button" type="primary" @click="submitForm">确 定</el-button>
        <el-button class="button" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--    配置设备参数-->
    <el-dialog :title="title" :visible.sync="configOpen"
               @closed="handleDialogClosed"
               :beforeDestroy="handleDialogBeforeDestroy" width="800px">
      <el-form ref="configForm" :model="configForm" :rules="rules3">
        <el-row>
          <el-col :span="6">
            <el-form-item label="时间格式">
              <el-select v-model="configForm.timeFormat" placeholder="请选择" clearable
                         style="width: 180px; margin-bottom: 0">
                <el-option
                  v-for="dict in dict.type.the_osd_time_format"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                />
                <!--
                :value="parseInt(dict.value)"
                当el-option下拉框从后端取到数据，但是显示的是数值，
                -->
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="显示文字" prop="customStr">
              <el-input v-model="configForm.customStr" style="width: 180px"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="OSD叠加" prop="osdEnable">
              <el-radio-group v-model="configForm.osdEnable">
                <el-radio
                  v-for="dict in dict.type.the_switch_status"
                  :key="dict.value"
                  :label="parseInt(dict.value)"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button class="button" style="margin-top: 40px" @click="sysTime()">同步时间</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-form ref="paramConfig" :model="paramConfig" :rules="rules4">
        <el-row>
          <el-col :span="12">
            <div style="height: 300px; width: 360px">
              <video id="" height="285" width="360"
                     muted="muted" autoplay="autoplay" ref="videoElement"
                     style="margin-top: 50px">
              </video>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调色板" prop="colorPlate" style="margin-bottom: 0">
              <el-select v-model="paramConfig.colorPlate" placeholder="请选择" style="width: 200px;">
                <el-option
                  v-for="dict in dict.type.the_color_plate"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发射率" prop="emissivity" style="margin-bottom: 10px">
              <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="paramConfig.emissivity"
                        placeholder="0.00~1.00"/>
            </el-form-item>
            <el-form-item label="湿度" prop="humidity" style="margin-bottom: 10px">
              <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="paramConfig.humidity"
                        placeholder="0.00~1.00"/>
            </el-form-item>
            <el-form-item label="反射温度(℃)" prop="reflectTemp" style="margin-bottom: 10px">
              <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="paramConfig.reflectTemp"
                        placeholder="-20.0~150.0"/>
            </el-form-item>
            <el-form-item label="环境温度(℃)" prop="airTemp" style="margin-bottom: 10px">
              <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="paramConfig.airTemp"
                        placeholder="-20.0~60.0"/>
            </el-form-item>
            <el-form-item label="距离(米)" prop="distance">
              <el-input oninput="value=value.replace(/^\.+|[^\d.]/g,'')" v-model="paramConfig.distance"
                        placeholder="0.0~100.0"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="button" type="primary" @click="submitConfig">确 定</el-button>
        <el-button class="button" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    listData,
    getData,
    delData,
    addData,
    updateData,
    searchData,
    loginEquipment,
    osdParamData,
    configData,
    osdData,
    paramData,
    authEquiment,
    configDataByEquip,
    osdParamDataByData,
    sysData
  } from "@/api/equipment/data";
  import {listGroup} from "@/api/equipment/group";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  import request from "../../../utils/request";
  import Wfs from '../../../api/mwfs'
  import data from "../../system/dict/data";
  import {listAlarmToday, offData} from "@/api/alarm/data";

  export default {
    name: "Data",
    components: {
      Treeselect
    },
    dicts: ['the_equipment_category', 'the_equipment_net_status', 'the_osd_time_format', 'the_color_plate', 'the_switch_status'],
    data() {
      return {
        isLoading: false,
        wfs: null, // 保存当前激活的 Wfs 实例
        videoRef: null,
        // 遮罩层
        loading: true,
        findLoading: false,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        //表单配置此参数
        configForm: {},
        paramConfig: {},
        // 新增模态框
        addEquipopen: false,

        //配置模态框
        configOpen: false,

        configEquipmentId: 0,
        configEquipmentName: "",
        // 总条数
        total: 0,
        // 设备数据表格数据
        dataList: [],

        //搜索设备列表
        eqList: [],
        // 设备分组树选项
        groupOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 登录设备密码时间范围
        daterangeCreateTime: [],
        // 登录设备密码时间范围
        daterangeUpdateTime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          groupId: null,
          groupName: null,
          name: null,
          netStatus: null,
          type: null,
          channel: null,
          ip: null,
          port: null,
          sn: null,
          pn: null,
          category: null,
          username: null,
          password: null
        },
        form: {},
        // 表单参数
        loginform: {
          username: '888888',
          password: '888888',
          port: '3000'
        },

        //新增校验
        rules1: {
          name: [
            {required: true, message: "设备名称不能为空", trigger: "blur"}
          ],
          netStatus: [
            {required: true, message: "请选择设备状态", trigger: "blur"}
          ],
          ip: [
            {required: true, message: "设备IP不能为空", trigger: "blur"}
          ],
          groupName: [
            {required: true, message: "相机位置不能为空", trigger: "blur"}
          ],
          port: [
            {required: true, message: "设备端口号不能为空", trigger: "blur"}
          ],
          channel: [
            {required: true, message: "信道不能为空", trigger: "blur"},
          ],
          username: [
            {required: true, message: "设备用户名不能为空", trigger: "blur"}
          ],
          password: [
            {required: true, message: "设备密码不能为空", trigger: "blur"}
          ],

        },
        //配置校验
        rules3: {
          timeFormat: [
            {required: true, message: "时间格式不能为空"}
          ],
          osdEnable: [
            {required: true, message: "OSD叠加不能为空"}
          ]
        },
        // 表单校验
        rules2: {
          username: [
            {required: true, message: "用户名不能为空"}
          ],
          password: [
            {required: true, message: "密码不能为空"}
          ],
          port: [
            {required: true, message: "端口号不能为空"}
          ]
        },

        rules4: {
          colorPlate: [
            {required: true, message: '调色板不能为空', trigger: 'blur'}
          ],
          emissivity: [
            {required: true, message: '发射率不能为空', trigger: 'blur'},
            {validator: this.validateEmissivity, trigger: 'blur'}
          ],
          humidity: [
            {required: true, message: '湿度不能为空', trigger: 'blur'},
            {validator: this.validateHumidity, trigger: 'blur'}
          ],
          reflectTemp: [
            {required: true, message: '反射温度不能为空', trigger: 'blur'},
            {validator: this.validateReflectTemp, trigger: 'blur'}
          ],
          airTemp: [
            {required: true, message: '环境温度不能为空', trigger: 'blur'},
            {validator: this.validateAirTemp, trigger: 'blur'}
          ],
          distance: [
            {required: true, message: '距离不能为空', trigger: 'blur'},
            {validator: this.validateDistance, trigger: 'blur'}
          ],
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
        //检查configOpen是否为true
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

      //查询当天报警的温度信息
      todayList() {
        listAlarmToday
      },

      /** 选中树节点*/
      selectTree(node) {
        this.form.groupId = node.id;
        this.form.groupName = node.groupName;
      },
      /** 转换设备分组数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.groupName,
          children: node.children
        };
      },
      /** 查询设备分组下拉树结构 */
      getTreeselect() {
        listGroup().then(response => {
          this.groupOptions = [];
          const data = {id: 0, groupName: '顶级节点', children: []};
          data.children = this.handleTree(response.data, "id", "parentId");
          this.groupOptions.push(data);
        });
      },
      /** 查询设备数据列表 */
      getList() {
        // this.loading = true;
        this.queryParams.params = {};
        if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
          this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
          this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
        }
        if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
          this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
          this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
        }
        listData(this.queryParams).then(response => {
          this.dataList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },

      //搜索设备后显示设备
      listEquiment() {
        this.equiData = {};
        searchData(this.equiData).then(response => {
          this.eqList = response.rows;
          this.eqList.forEach(item=>{
            if (item.name === '' || this.eqList.name === null) {
              item.name = 'Default'
            }
          })
          this.findLoading = false;
        })
      },
      // 取消按钮
      cancel() {
        this.addEquipopen = false;
        this.configOpen = false;
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          remark: null,
          groupId: null,
          groupName: null,
          name: null,
          netStatus: null,
          type: null,
          channel: null,
          ip: null,
          port: null,
          sn: null,
          pn: null,
          category: 0,
          username: 888888,
          password: 888888
        };

        this.resetForm("form");
      },
      // 搜索设备按钮操作
      queryEquiment() {
        this.findLoading = true;
        this.listEquiment();
      },

      //添加按钮 新增搜索后出现的设备到显示中去
      addEquipment(row) {
        if (this.equiData != null) {
          this.equipAddRow = row
          this.getTreeselect();
          this.open = true;
          this.title = "认证"
        } else {
          this.$modal.msgError("请选择设备");
          this.open = false;
        }
      },

      /** 重置按钮操作 */
      resetQuery() {
        this.daterangeCreateTime = [];
        this.daterangeUpdateTime = [];
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.getTreeselect();
        this.addEquipopen = true;
        this.title = "添加设备数据";
      },
      /** 编辑按钮操作 */
      handleUpdate(row) {
        this.reset();
        this.getTreeselect();
        const id = row.id || this.ids
        getData(id).then(response => {
          this.form = response.data;
          this.addEquipopen = true;
          this.title = "编辑设备";
          this.getList()
        });
      },

      /** 配置设备  */
      async configEquip(row) {
        if (Wfs.isSupported()) {
          this.configEquipmentId = row.id
          this.configEquipmentName = row.name
          const equipmentId = row.id || this.ids
          this.configForm.timeFormat = 1
          this.configForm.osdEnable = 1
          this.paramConfig.colorPlate = 0
          if (row.netStatus != 0) {
            //先查数据库
            configData(equipmentId)
              .then(response => {
                if (response.data != null) {
                  // 不为空直接赋值
                  this.paramConfig = response.data;
                } else {
                  // 如果返回数据为空，则再发起一次请求
                  return configDataByEquip(equipmentId);
                }
              })
              .then(response => {
                if (response && response.data != null) {
                  // 获取到数据后赋值
                  this.paramConfig = response.data;
                }
              })
              .catch(error => {
                // 处理错误情况
                console.error(error);
              });
            this.configParam(equipmentId);
            this.configOpen = true;
            this.title = "设备视频配置";

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
            this.configOpen = false
            this.$modal.msgError("设备已离线");
          }
        }
      },

      async configParam(equipmentId) {
        await osdParamDataByData(equipmentId).then(res => {
          if (res.data != null) {
            this.configForm = res.data;
          }
        })
      },
      //提交新增或编辑按钮
      submit() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.id != undefined) {
              updateData(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.addEquipopen = false;
                this.getList();
              });
            } else {
              addData(this.form).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.addEquipopen = false;
                this.getList();
              });
              // this.authEquiment(this.form);
              if (this.form.ip != null) {
                // this.$modal.msgError("该设备已存在");
                this.addEquipopen = true;
              }
            }
          }
        });
      },
      // async authEquiment() {
      //   await authEquiment(this.form).then(res => {
      //     console.log(res)
      //   })
      // },

      /** 搜索新设备提交按钮 */
      submitForm() {
        this.$refs["loginform"].validate(valid => {
          if (valid) {
            this.isLoading = false;
            this.equipAddRow.username = this.loginform.username
            this.equipAddRow.password = this.loginform.password;
            this.equipAddRow.port = this.loginform.port;
            this.equipAddRow.category = 0
            // console.log(this.equipAddRow)
            addData(this.equipAddRow).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        })
      },
      async loginEquipment(id) {
        await loginEquipment(id).then(res => {
          // console.log(res)
        })
      },

      //同步时间
      sysTime() {
        const equipmentId = this.configEquipmentId
        sysData(equipmentId).then(res => {
          this.$modal.msgSuccess("OSD同步系统时间");
        })
      },

      //配置信息提交
      async submitConfig() {
        // 对多个表单组件进行校验
        const [valid1, valid2] = await Promise.all([
          this.$refs.paramConfig.validate(),
          this.$refs.configForm.validate(),

        ]);
        if (valid1 && valid2) {
          this.paramConfig.equipmentId = this.configEquipmentId;
          this.paramConfig.equipmentName = this.configEquipmentName
          this.configForm.equipmentId = this.configEquipmentId
          this.configForm.equipmentName = this.configEquipmentName

          this.isLoading = true; // 将 isLoading 设置为 true
          paramData(this.paramConfig).then(response => {
            this.$modal.msgSuccess("配置成功");
            this.isLoading = false; // 配置成功提示信息显示完成后再将 isLoading 设置为 false
            // this.configOpen = false;
            // this.getList();
          });
          osdData(this.configForm).then(response => {
            // this.$modal.msgSuccess("配置成功");
          });
          this.getList();
          this.configOpen = false;

        }
      },

      /** 删除按钮操作 */
      handleDelete(row) {
        if (row.id != null) {
          const ids = row.id || this.ids;
          this.$modal.confirm('是否确认删除设备数据编号为"' + ids + '"的数据项？').then(function () {
            return delData(ids);
          }).then(() => {
            this.getList();
            this.closeOtherPages();
            this.$modal.msgSuccess("删除成功");
          }).catch(() => {
          });
          //关闭监控任务请求
          offData(row.id)
        } else {
          this.$modal.msgError("请选择数据");
        }
      },
      /** 删除设备后关闭除当前页面以外的其他页面*/
      closeOtherPages() {
        this.$tab.closeAllPage()
      },

      //
      validateEmissivity(rule, value, callback) {
        const placeholder = '0.00~1.00';
        const [min, max] = placeholder.split('~').map(Number);
        if (value >= min && value <= max) {
          callback();
        } else {
          callback(new Error(`请输入${placeholder}范围内的值`));
        }
      },
      validateHumidity(rule, value, callback) {
        const placeholder = '0.00~1.00';
        const [min, max] = placeholder.split('~').map(Number);
        if (value >= min && value <= max) {
          callback();
        } else {
          callback(new Error(`请输入${placeholder}范围内的值`));
        }
      },
      validateReflectTemp(rule, value, callback) {
        const placeholder = '-20.0~150.0';
        const [min, max] = placeholder.split('~').map(Number);
        if (value >= min && value <= max) {
          callback();
        } else {
          callback(new Error(`请输入${placeholder}范围内的值`));
        }
      },
      validateAirTemp(rule, value, callback) {
        const placeholder = '-20.0~60.0';
        const [min, max] = placeholder.split('~').map(Number);
        if (value >= min && value <= max) {
          callback();
        } else {
          callback(new Error(`请输入${placeholder}范围内的值`));
        }
      },
      validateDistance(rule, value, callback) {
        const placeholder = '0.0~100.0';
        const [min, max] = placeholder.split('~').map(Number);
        if (value >= min && value <= max) {
          callback();
        } else {
          callback(new Error(`请输入${placeholder}范围内的值`));
        }
      },
      filterChannel() {
        this.form.channel = this.form.channel.replace(/[^0-2]/g, ''); // 过滤非0、1、2的字符
      },

      /** 导出按钮操作 */
      handleExport() {
        this.download('equipment/data/export', {
          ...this.queryParams
        }, `data_${new Date().getTime()}.xlsx`)
      }
    }
  };
</script>
<style>
  .el-input__inner {
    background-color: #303133;
    border: 1px solid #303133;
    color: #dadada;
  }

  /*
  点击之后边框的高亮颜色改变
  */
  .el-input__inner:focus {
    border: 1px solid #5e6493;
  }

  .el-input__inner:hover {
    border: 1px solid #5e6493;
  }

  .el-form-item__label {
    color: #dadada;
    font-weight: 550;
    font-size: .9em;
  }

  .el-radio {
    color: #dadada;

  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #5e6493;
    background: #5e6493;
  }

  .el-radio__input.is-checked + .el-radio__label {
    color: #5e6493;
  }

  .el-radio__label {
    padding-left: 10px;
    font-weight: 550;
    font-size: 1em;
  }

  .el-input--medium .el-input__inner {
    font-weight: 550;
    font-size: .95em;
  }

  .button {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
    font-weight: 700 !important;
    font-size: .85em !important;
    display: inline-block;
  }

  .el-button--small {
    color: #dadada !important;
    background-color: #303133 !important;
    border-color: #303133 !important;
    font-weight: 600 !important;
    font-size: .75em !important;
    border-radius: 3px;
  }

  .el-message-box__headerbtn .el-message-box__close:focus {
    color: #5e6493;
  }

  .button .button-text {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*.el-button {*/
  /*  color: #dadada !important;*/
  /*  background-color: #303133 !important;*/
  /*  border-color: #303133 !important;*/
  /*  font-weight: 700;*/
  /*  font-size: .85em;*/
  /*}*/

  /*
  按钮悬浮
  */
  .el-button:hover {
    border-color: #303133;
  }

  /*
  按钮点击#60656e
  */
  .el-button:focus {
    background-color: #2c2832 !important;
    border-color: #2c2832 !important;
    color: #5e6493 !important;
  }

  .el-button.clicked {
    background-color: #303133 !important;
    border-color: #303133 !important;
    color: #dadada !important;
  }

  .el-select .el-input.is-focus .el-input__inner:hover {
    border: 1px solid #303133 !important;
  }

  .el-select-dropdown {
    background-color: #303133;
    border: solid 1px #303133;
    border-radius: 4px;
    color: #dadada;
  }

  .el-select-dropdown__list {
    background: #303133;
    border: solid #303133 !important;
  }

  .el-select-dropdown__item {
    color: #dadada;
  }

  .el-select-dropdown__item.selected {
    color: #5e6493;
    background: #2c2832;
  }

  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    color: #5e6493;
    background: #2c2832;
  }

  .el-popper[x-placement^=bottom] .popper__arrow {
    border-bottom-color: #303133;
  }

  .el-popper[x-placement^=bottom] .popper__arrow::after {
    border-bottom-color: #303133;
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td {
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
    background-color: #303133 !important;
    border-color: #303133 !important;
    color: #13ce66 !important;
    font-weight: 500 !important;
    font-size: 0.95em !important;
  }

  .el-tag.el-tag--warning {
    background-color: #303133;
    border-color: #303133;
    color: #dadada;
    font-weight: 500;
    font-size: 0.95em;
  }

  /*.el-tag.el-tag--danger {*/
  /*  background-color: #303133;*/
  /*  border-color: #303133;*/
  /*  color: #dadada;*/
  /*  font-weight: 500;*/
  /*  font-size: 0.95em;*/
  /*}*/

  .button-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
</style>
