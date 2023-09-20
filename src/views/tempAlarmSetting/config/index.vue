<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="区域名称" prop="regionName">
        <el-input
          v-model="queryParams.regionName"
          placeholder="请输入区域名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配置名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入配置名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="配置类型" prop="mode">
        <el-select v-model="queryParams.mode" placeholder="请选择配置类型" clearable>
          <el-option
            v-for="dict in dict.type.the_alarm_mode_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="区域索引" prop="regionIndex">
        <el-input
          v-model="queryParams.regionIndex"
          placeholder="请输入区域索引"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入创建人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="更新人" prop="updateBy">
        <el-input
          v-model="queryParams.updateBy"
          placeholder="请输入更新人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新时间">
        <el-date-picker
          v-model="daterangeUpdateTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['tempAlarmSetting:config:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['tempAlarmSetting:config:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['tempAlarmSetting:config:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['tempAlarmSetting:config:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="configList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="ID" align="center" prop="id" />-->
<!--       <el-table-column label="区域ID" align="center" prop="regionId" />-->
      <el-table-column label="设备名称" align="center" prop="equipmentName" />
      <el-table-column label="区域名称" align="center" prop="regionName" />
      <el-table-column label="配置名称" align="center" prop="name" />
      <el-table-column label="报警开关" align="center" prop="tempAlarmSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.tempAlarmSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="配置类型" align="center" prop="mode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_alarm_mode_type" :value="scope.row.mode"/>
        </template>
      </el-table-column>
      <el-table-column label="区域索引" align="center" prop="regionIndex" />
      <el-table-column label="高温报警开关" align="center" prop="highTempAlarmEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.highTempAlarmEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="低温报警开关" align="center" prop="lowTempAlarmEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.lowTempAlarmEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="高温报警等级开关" align="center" prop="highTempAlarmLevelEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.highTempAlarmLevelEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="低温报警等级开关" align="center" prop="lowTempAlarmLevelEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.lowTempAlarmLevelEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="弹出开关" align="center" prop="popUpEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.popUpEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="响铃开关" align="center" prop="ringEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.ringEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="抓拍开关" align="center" prop="snapEnable">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.snapEnable"/>
        </template>
      </el-table-column>
      <el-table-column label="去抖动时间" align="center" prop="debounce" />
      <el-table-column label="高温阈值" align="center" prop="highTempThreshold" />
      <el-table-column label="高温阈值一级" align="center" prop="highTempThresholdLevel1" />
      <el-table-column label="高温阈值二级" align="center" prop="highTempThresholdLevel2" />
      <el-table-column label="高温阈值三级" align="center" prop="highTempThresholdLevel3" />
      <el-table-column label="低温阈值" align="center" prop="lowTempThreshold" />
      <el-table-column label="低温阈值一级" align="center" prop="lowTempThresholdLevel1" />
      <el-table-column label="低温阈值二级" align="center" prop="lowTempThresholdLevel2" />
      <el-table-column label="低温阈值三级" align="center" prop="lowTempThresholdLevel3" />
      <el-table-column label="起始X轴坐标" align="center" prop="startPosX" />
      <el-table-column label="起始Y轴坐标" align="center" prop="startPosY" />
      <el-table-column label="结束X轴坐标" align="center" prop="endPosX" />
      <el-table-column label="结束Y轴坐标" align="center" prop="endPosY" />
      <el-table-column label="联动声音开关" align="center" prop="ringSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.ringSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="联动抓拍开关" align="center" prop="snapSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.snapSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="联动抓拍开关" align="center" prop="recordSwitch">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.the_switch_status" :value="scope.row.recordSwitch"/>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="updateBy" />
      <el-table-column label="更新时间" align="center" prop="updateTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['tempAlarmSetting:config:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tempAlarmSetting:config:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改测温报警配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="设备ID" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input v-model="form.equipmentName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="区域ID" prop="regionId">
          <el-input v-model="form.regionId" placeholder="请输入区域ID" />
        </el-form-item>
        <el-form-item label="区域名称" prop="regionName">
          <el-input v-model="form.regionName" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="报警开关" prop="tempAlarmSwitch">
          <el-radio-group v-model="form.tempAlarmSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置类型" prop="mode">
          <el-select v-model="form.mode" placeholder="请选择配置类型">
            <el-option
              v-for="dict in dict.type.the_alarm_mode_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域索引" prop="regionIndex">
          <el-input v-model="form.regionIndex" placeholder="请输入区域索引" />
        </el-form-item>
        <el-form-item label="高温报警开关" prop="highTempAlarmEnable">
          <el-radio-group v-model="form.highTempAlarmEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="低温报警开关" prop="lowTempAlarmEnable">
          <el-radio-group v-model="form.lowTempAlarmEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="高温报警等级开关" prop="highTempAlarmLevelEnable">
          <el-radio-group v-model="form.highTempAlarmLevelEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="低温报警等级开关" prop="lowTempAlarmLevelEnable">
          <el-radio-group v-model="form.lowTempAlarmLevelEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="弹出开关" prop="popUpEnable">
          <el-radio-group v-model="form.popUpEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="响铃开关" prop="ringEnable">
          <el-radio-group v-model="form.ringEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抓拍开关" prop="snapEnable">
          <el-radio-group v-model="form.snapEnable">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="去抖动时间" prop="debounce">
          <el-input v-model="form.debounce" placeholder="请输入去抖动时间" />
        </el-form-item>
        <el-form-item label="高温阈值" prop="highTempThreshold">
          <el-input v-model="form.highTempThreshold" placeholder="请输入高温阈值" />
        </el-form-item>
        <el-form-item label="高温阈值一级" prop="highTempThresholdLevel1">
          <el-input v-model="form.highTempThresholdLevel1" placeholder="请输入高温阈值一级" />
        </el-form-item>
        <el-form-item label="高温阈值二级" prop="highTempThresholdLevel2">
          <el-input v-model="form.highTempThresholdLevel2" placeholder="请输入高温阈值二级" />
        </el-form-item>
        <el-form-item label="高温阈值三级" prop="highTempThresholdLevel3">
          <el-input v-model="form.highTempThresholdLevel3" placeholder="请输入高温阈值三级" />
        </el-form-item>
        <el-form-item label="低温阈值" prop="lowTempThreshold">
          <el-input v-model="form.lowTempThreshold" placeholder="请输入低温阈值" />
        </el-form-item>
        <el-form-item label="低温阈值一级" prop="lowTempThresholdLevel1">
          <el-input v-model="form.lowTempThresholdLevel1" placeholder="请输入低温阈值一级" />
        </el-form-item>
        <el-form-item label="低温阈值二级" prop="lowTempThresholdLevel2">
          <el-input v-model="form.lowTempThresholdLevel2" placeholder="请输入低温阈值二级" />
        </el-form-item>
        <el-form-item label="低温阈值三级" prop="lowTempThresholdLevel3">
          <el-input v-model="form.lowTempThresholdLevel3" placeholder="请输入低温阈值三级" />
        </el-form-item>
        <el-form-item label="起始X轴坐标" prop="startPosX">
          <el-input v-model="form.startPosX" placeholder="请输入起始X轴坐标" />
        </el-form-item>
        <el-form-item label="起始Y轴坐标" prop="startPosY">
          <el-input v-model="form.startPosY" placeholder="请输入起始Y轴坐标" />
        </el-form-item>
        <el-form-item label="结束X轴坐标" prop="endPosX">
          <el-input v-model="form.endPosX" placeholder="请输入结束X轴坐标" />
        </el-form-item>
        <el-form-item label="结束Y轴坐标" prop="endPosY">
          <el-input v-model="form.endPosY" placeholder="请输入结束Y轴坐标" />
        </el-form-item>
        <el-form-item label="联动声音开关" prop="ringSwitch">
          <el-radio-group v-model="form.ringSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联动抓拍开关" prop="snapSwitch">
          <el-radio-group v-model="form.snapSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联动抓拍开关" prop="recordSwitch">
          <el-radio-group v-model="form.recordSwitch">
            <el-radio
              v-for="dict in dict.type.the_switch_status"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from "@/api/tempAlarmSetting/config";

export default {
  name: "Config",
  dicts: ['the_alarm_mode_type', 'the_switch_status'],
  data() {
    return {
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
      // 测温报警配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 联动抓拍开关时间范围
      daterangeCreateTime: [],
      // 联动抓拍开关时间范围
      daterangeUpdateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        regionName: null,
        equipmentName: null,
        name: null,
        mode: null,
        regionIndex: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equipmentId: [
          { required: true, message: "设备ID不能为空", trigger: "blur" }
        ],
        equipmentName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        regionId: [
          { required: true, message: "区域ID不能为空", trigger: "blur" }
        ],
        regionName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" }
        ],
        tempAlarmSwitch: [
          { required: true, message: "报警开关不能为空", trigger: "change" }
        ],
        mode: [
          { required: true, message: "配置类型不能为空", trigger: "change" }
        ],
        regionIndex: [
          { required: false, message: "区域索引不能为空", trigger: "blur" }
        ],
        highTempAlarmEnable: [
          { required: false, message: "高温报警开关不能为空", trigger: "change" }
        ],
        lowTempAlarmEnable: [
          { required: false, message: "低温报警开关不能为空", trigger: "change" }
        ],
        highTempAlarmLevelEnable: [
          { required: false, message: "高温报警等级开关不能为空", trigger: "change" }
        ],
        lowTempAlarmLevelEnable: [
          { required: false, message: "低温报警等级开关不能为空", trigger: "change" }
        ],
        popUpEnable: [
          { required: false, message: "弹出开关不能为空", trigger: "change" }
        ],
        ringEnable: [
          { required: false, message: "响铃开关不能为空", trigger: "change" }
        ],
        snapEnable: [
          { required: false, message: "抓拍开关不能为空", trigger: "change" }
        ],
        debounce: [
          { required: false, message: "去抖动时间不能为空", trigger: "blur" }
        ],
        highTempThreshold: [
          { required: false, message: "高温阈值不能为空", trigger: "blur" }
        ],
        highTempThresholdLevel1: [
          { required: false, message: "高温阈值一级不能为空", trigger: "blur" }
        ],
        highTempThresholdLevel2: [
          { required: false, message: "高温阈值二级不能为空", trigger: "blur" }
        ],
        highTempThresholdLevel3: [
          { required: false, message: "高温阈值三级不能为空", trigger: "blur" }
        ],
        lowTempThreshold: [
          { required: false, message: "低温阈值不能为空", trigger: "blur" }
        ],
        lowTempThresholdLevel1: [
          { required: false, message: "低温阈值一级不能为空", trigger: "blur" }
        ],
        lowTempThresholdLevel2: [
          { required: false, message: "低温阈值二级不能为空", trigger: "blur" }
        ],
        lowTempThresholdLevel3: [
          { required: false, message: "低温阈值三级不能为空", trigger: "blur" }
        ],
        startPosX: [
          { required: false, message: "起始X轴坐标不能为空", trigger: "blur" }
        ],
        startPosY: [
          { required: false, message: "起始Y轴坐标不能为空", trigger: "blur" }
        ],
        endPosX: [
          { required: false, message: "结束X轴坐标不能为空", trigger: "blur" }
        ],
        endPosY: [
          { required: false, message: "结束Y轴坐标不能为空", trigger: "blur" }
        ],
        ringSwitch: [
          { required: false, message: "联动声音开关不能为空", trigger: "change" }
        ],
        snapSwitch: [
          { required: false, message: "联动抓拍开关不能为空", trigger: "change" }
        ],
        recordSwitch: [
          { required: false, message: "联动抓拍开关不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询测温报警配置列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params["beginCreateTime"] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      if (null != this.daterangeUpdateTime && '' != this.daterangeUpdateTime) {
        this.queryParams.params["beginUpdateTime"] = this.daterangeUpdateTime[0];
        this.queryParams.params["endUpdateTime"] = this.daterangeUpdateTime[1];
      }
      listConfig(this.queryParams).then(response => {
        this.configList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
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
        equipmentId: null,
        equipmentName: null,
        regionId: null,
        regionName: null,
        name: null,
        tempAlarmSwitch: null,
        mode: null,
        regionIndex: null,
        highTempAlarmEnable: null,
        lowTempAlarmEnable: null,
        highTempAlarmLevelEnable: null,
        lowTempAlarmLevelEnable: null,
        popUpEnable: null,
        ringEnable: null,
        snapEnable: null,
        debounce: null,
        highTempThreshold: null,
        highTempThresholdLevel1: null,
        highTempThresholdLevel2: null,
        highTempThresholdLevel3: null,
        lowTempThreshold: null,
        lowTempThresholdLevel1: null,
        lowTempThresholdLevel2: null,
        lowTempThresholdLevel3: null,
        startPosX: null,
        startPosY: null,
        endPosX: null,
        endPosY: null,
        ringSwitch: null,
        snapSwitch: null,
        recordSwitch: null
      };
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
      this.daterangeUpdateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加测温报警配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getConfig(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改测温报警配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateConfig(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addConfig(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除测温报警配置编号为"' + ids + '"的数据项？').then(function() {
        return delConfig(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tempAlarmSetting/config/export', {
        ...this.queryParams
      }, `config_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
